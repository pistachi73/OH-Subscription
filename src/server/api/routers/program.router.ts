import { TRPCError } from "@trpc/server";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";

import type {
  Category,
  ProgramLevel,
  Teacher,
  Video,
} from "../../db/schema.types";
import {
  programsWithCategories,
  programsWithChapters,
  programsWithTeachers,
} from "../query-utils/programs.query";
import { withLimit, withOffset } from "../query-utils/shared.query";
import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import { toKebabCase } from "@/lib/case-converters";
import { isNumber } from "@/lib/utils";
import {
  CategoriesOnProgramsSchema,
  ProgramSchema,
  TeachersOnProgramsSchema,
  VideosOnProgramsSchema,
} from "@/schemas";
import {
  categories,
  categoriesOnPrograms,
  programs,
  teachers,
  teachersOnPrograms,
  videos,
  videosOnPrograms,
} from "@/server/db/schema";

const programSelect = {
  with: {
    teachers: {
      columns: {
        teacherId: false,
        programId: false,
      },
      with: {
        teacher: {
          columns: {
            name: true,
            id: true,
          },
        },
      },
    },
    categories: {
      columns: {
        categoryId: false,
        programId: false,
      },
      with: {
        category: {
          columns: {
            name: true,
            id: true,
          },
        },
      },
    },
    chapters: true,
  },
} as const;

export const programRouter = createTRPCRouter({
  delete: adminProtectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const { db } = ctx;
      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Program ID is required",
        });
      }

      const program = await db
        .select()
        .from(programs)
        .where(eq(programs.id, id));
      const thumbnail = program?.[0]?.thumbnail;

      if (thumbnail) {
        await deleteFile({ fileName: thumbnail });
      }

      await db.delete(programs).where(eq(programs.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(ProgramSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { thumbnail, ...values } = input;

      await db.insert(programs).values({
        ...values,
        slug: toKebabCase(values.title) as string,
        thumbnail: typeof thumbnail === "string" ? thumbnail : null,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(ProgramSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, thumbnail, ...values } = input;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Program ID is required",
        });
      }

      const program = await db
        .select()
        .from(programs)
        .where(eq(programs.id, Number(id)));

      let currentProgramThumbnail = program?.[0]?.thumbnail;

      if (typeof thumbnail === "string") {
        currentProgramThumbnail = thumbnail;
      }

      if (!thumbnail && currentProgramThumbnail) {
        await deleteFile({ fileName: currentProgramThumbnail });
        currentProgramThumbnail = null;
      }

      await db
        .update(programs)
        .set({
          ...values,
          slug: toKebabCase(values.title) as string,
          thumbnail: thumbnail ? currentProgramThumbnail : null,
        })
        .where(eq(programs.id, Number(id)));

      return { success: true, id: Number(id) };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const allPrograms = await db.query.programs.findMany();

    return allPrograms;
  }),

  getAllForLanding: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    return await db.query.programs.findMany({
      with: {
        teachers: {
          columns: {
            teacherId: false,
            programId: false,
          },
          with: {
            teacher: {
              columns: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }),

  getProgramsForCards: publicProcedure
    .input(
      z
        .object({
          teacherIds: z.array(z.number()).optional(),
          categoryIds: z.array(z.number()).optional(),
          categoryNames: z.array(z.string()).optional(),
          levelIds: z.array(z.string()).optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
          searchQuery: z.string().optional(),
          minQueryTime: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const {
        teacherIds,
        categoryIds,
        categoryNames,
        limit,
        offset,
        minQueryTime,
        levelIds,
        searchQuery,
      } = input ?? {};

      const hasCategoryFilters =
        categoryIds?.length || categoryNames?.length || levelIds?.length;

      let programsForCardsQuery = ctx.db
        .select({
          id: programs.id,
          title: programs.title,
          description: programs.description,
          thumbnail: programs.thumbnail,
          level: programs.level,
          slug: programs.slug,
          totalChapters: programs.totalChapters,
          teachers: sql<Omit<Teacher, "bio">[]>`json_agg(DISTINCT
                    jsonb_build_object(
                      'id', ${teachers.id},
                      'image', ${teachers.image},
                      'name', ${teachers.name})
                    )`,
        })
        .from(programs)
        .$dynamic();

      programsForCardsQuery = programsWithTeachers(programsForCardsQuery);

      if (hasCategoryFilters) {
        programsForCardsQuery = programsWithCategories(programsForCardsQuery);
      }

      const whereClauses = [];

      if (teacherIds?.length) {
        whereClauses.push(inArray(teachers.id, teacherIds));
      }
      if (categoryIds?.length) {
        whereClauses.push(inArray(categories.id, categoryIds));
      }

      if (categoryNames?.length) {
        whereClauses.push(
          inArray(
            sql`lower(${categories.name})`,
            categoryNames.map((name) => name.toLowerCase()),
          ),
        );
      }

      if (levelIds?.length) {
        whereClauses.push(inArray(programs.level, levelIds as ProgramLevel[]));
      }

      programsForCardsQuery.where(
        searchQuery
          ? and(
              sql`${programs.document} @@ to_tsquery('english', ${`${searchQuery
                .split(" ")
                .filter(Boolean)
                .join("&")}:*`})`,
              or(...whereClauses),
            )
          : or(...whereClauses),
      );

      if (limit) {
        programsForCardsQuery = withLimit(programsForCardsQuery, limit);
      }

      if (offset) {
        programsForCardsQuery = withOffset(programsForCardsQuery, offset);
      }

      programsForCardsQuery = programsForCardsQuery.groupBy(programs.id);

      const startTime = Date.now();

      const res = await programsForCardsQuery.execute();
      const timeTaken = Date.now() - startTime;

      if (minQueryTime && timeTaken < minQueryTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minQueryTime - timeTaken),
        );
      }

      return res;
    }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;

      const program = await db.query.programs.findFirst({
        where: eq(programs.id, id),
        with: {
          teachers: {
            columns: {
              teacherId: false,
              programId: false,
            },
            with: {
              teacher: {
                columns: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          categories: {
            columns: {
              categoryId: false,
              programId: false,
            },
            with: {
              category: {
                columns: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          chapters: {
            columns: {
              chapterNumber: true,
              videoId: true,
            },
          },
        },
      });

      return program;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input: { slug }, ctx }) => {
      let programQuery = ctx.db
        .select({
          id: programs.id,
          title: programs.title,
          description: programs.description,
          thumbnail: programs.thumbnail,
          level: programs.level,
          slug: programs.slug,
          totalChapters: programs.totalChapters,
          updatedAt: programs.updatedAt,
          teachers: sql<Omit<Teacher, "bio">[]>`json_agg(DISTINCT
                    jsonb_build_object(
                      'id', ${teachers.id},
                      'image', ${teachers.image},
                      'name', ${teachers.name})
                    )`,
          categories: sql<Category[]>`json_agg(DISTINCT
                    jsonb_build_object(
                      'id', ${categories.id},
                      'name', ${categories.name})
                    )`,
          chapters: sql<
            (Pick<
              Video,
              | "updatedAt"
              | "slug"
              | "duration"
              | "description"
              | "thumbnail"
              | "title"
            > & { chapterNumber: number })[]
          >`json_agg(DISTINCT
            jsonb_build_object(
              'updatedAt', ${videos.updatedAt},
              'slug', ${videos.slug},
              'duration', ${videos.duration},
              'description', ${videos.description},
              'thumbnail', ${videos.thumbnail},
              'title', ${videos.title},
              'chapterNumber', ${videosOnPrograms.chapterNumber})
            )`,
        })
        .from(programs)
        .where(eq(programs.slug, slug))
        .$dynamic();

      programQuery = programsWithTeachers(programQuery);
      programQuery = programsWithCategories(programQuery);
      programQuery = programsWithChapters(programQuery);
      programQuery = programQuery.groupBy(programs.id);

      const res = await programQuery.execute();

      const p = res[0];

      if (!p) return null;

      p.chapters = p.chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

      return p;
    }),

  addTeacher: adminProtectedProcedure
    .input(TeachersOnProgramsSchema)
    .mutation(async ({ input: { programId, teacherId }, ctx: { db } }) => {
      await db.insert(teachersOnPrograms).values({
        programId,
        teacherId,
      });

      return true;
    }),

  removeTeacher: adminProtectedProcedure
    .input(TeachersOnProgramsSchema)
    .mutation(async ({ input: { programId, teacherId }, ctx: { db } }) => {
      await db
        .delete(teachersOnPrograms)
        .where(
          and(
            eq(teachersOnPrograms.programId, programId),
            eq(teachersOnPrograms.teacherId, teacherId),
          ),
        );

      return true;
    }),

  addCategory: adminProtectedProcedure
    .input(CategoriesOnProgramsSchema)
    .mutation(async ({ input: { programId, categoryId }, ctx: { db } }) => {
      await db.insert(categoriesOnPrograms).values({
        programId,
        categoryId,
      });

      return true;
    }),

  removeCategory: adminProtectedProcedure
    .input(CategoriesOnProgramsSchema)
    .mutation(async ({ input: { programId, categoryId }, ctx: { db } }) => {
      await db
        .delete(categoriesOnPrograms)
        .where(
          and(
            eq(categoriesOnPrograms.programId, programId),
            eq(categoriesOnPrograms.categoryId, categoryId),
          ),
        );

      return true;
    }),

  addChapter: adminProtectedProcedure
    .input(VideosOnProgramsSchema)
    .mutation(
      async ({ input: { videoId, programId, chapterNumber }, ctx: { db } }) => {
        await db.insert(videosOnPrograms).values({
          programId,
          videoId,
          chapterNumber: chapterNumber || 1,
        });

        return true;
      },
    ),

  updateChapter: adminProtectedProcedure
    .input(VideosOnProgramsSchema)
    .mutation(
      async ({ input: { videoId, programId, chapterNumber }, ctx: { db } }) => {
        await db
          .update(videosOnPrograms)
          .set({ chapterNumber })
          .where(
            and(
              eq(videosOnPrograms.programId, programId),
              eq(videosOnPrograms.videoId, videoId),
            ),
          );

        return true;
      },
    ),

  removeChapter: adminProtectedProcedure
    .input(VideosOnProgramsSchema)
    .mutation(async ({ input: { videoId, programId }, ctx: { db } }) => {
      await db
        .delete(videosOnPrograms)
        .where(
          and(
            eq(videosOnPrograms.programId, programId),
            eq(videosOnPrograms.videoId, videoId),
          ),
        );

      return true;
    }),
});
