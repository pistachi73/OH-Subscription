import { TRPCError } from "@trpc/server";
import type { SQL } from "drizzle-orm";
import {
  and,
  cosineDistance,
  desc,
  eq,
  gt,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import { z } from "zod";

import { sortChaptersByChapterNumber } from "../formatters/format-program";
import {
  firstChapterSubquery,
  isProgramLikedByUserSubquery,
  lastWatchedChapterSubquery,
  programCategoriesSelect,
  programChaptersSelect,
  programTeachersSelect,
  programsWithCategories,
  programsWithChapters,
  programsWithTeachers,
  sharedProgramSelect,
} from "../query-utils/programs.query";
import { withLimit, withOffset } from "../query-utils/shared.query";
import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import { isNumber } from "@/lib/utils/is-number";

import * as schema from "@/server/db/schema";
import {
  CategoryProgramInsertSchema,
  type LastWatchedChapter,
  ProgramDeleteSchema,
  ProgramInsertSchema,
  type ProgramLevel,
  ProgramUpdateSchema,
  TeacherProgramInsertSchema,
  VideoProgramInsertSchema,
} from "@/types";
import { sortChaptersByLastWatched } from "../formatters/format-program";
import { generateEmbedding } from "../lib/openai";

export const programRouter = createTRPCRouter({
  getProgramCards: publicProcedure
    .input(
      z
        .object({
          teacherIds: z.array(z.number()).optional(),
          categoryIds: z.array(z.number()).optional(),
          categoryNames: z.array(z.string()).optional(),
          categorySlugs: z.array(z.string()).optional(),
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
        categorySlugs,
        limit,
        offset,
        minQueryTime,
        levelIds,
        searchQuery,
      } = input ?? {};

      let similarity: SQL<number> | null = null;
      if (searchQuery) {
        const embedding = await generateEmbedding(searchQuery);

        if (embedding) {
          similarity = sql<number>`1 - (${cosineDistance(
            schema.program.embedding,
            embedding,
          )})`;
        }
      }

      let programsForCardsQuery = ctx.db
        .select({
          id: schema.program.id,
          title: schema.program.title,
          description: schema.program.description,
          thumbnail: schema.program.thumbnail,
          level: schema.program.level,
          slug: schema.program.slug,
          totalChapters: schema.program.totalChapters,
          teachers: programTeachersSelect,
          categories: programCategoriesSelect,
          isLikedByUser: isProgramLikedByUserSubquery({
            db: ctx.db,
            userId: ctx.session?.user?.id,
          }),

          lastWatchedChapter: lastWatchedChapterSubquery({
            db: ctx.db,
            userId: ctx.session?.user?.id,
          }),
          firstChapter: firstChapterSubquery({
            db: ctx.db,
          }),
          ...(similarity && { similarity }),
        })
        .from(schema.program)
        .$dynamic();

      programsForCardsQuery = programsWithTeachers(programsForCardsQuery);
      programsForCardsQuery = programsWithCategories(programsForCardsQuery);

      const whereClauses = [
        teacherIds?.length ? inArray(schema.teacher.id, teacherIds) : undefined,
        categoryIds?.length
          ? inArray(schema.category.id, categoryIds)
          : undefined,
        levelIds?.length
          ? inArray(schema.program.level, levelIds as ProgramLevel[])
          : undefined,
        categoryNames?.length
          ? inArray(
              sql`lower(${schema.category.name})`,
              categoryNames.map((name) => name.toLowerCase()),
            )
          : undefined,
        categorySlugs?.length
          ? inArray(schema.category.slug, categorySlugs)
          : undefined,
      ];

      if (similarity) {
        programsForCardsQuery = programsForCardsQuery.where(
          and(gt(similarity, 0.5), or(...whereClauses)),
        );
        programsForCardsQuery = programsForCardsQuery.orderBy((t) =>
          // biome-ignore lint/style/noNonNullAssertion: Already checked for null
          desc(t.similarity!),
        );
      } else {
        programsForCardsQuery = programsForCardsQuery.where(
          or(...whereClauses),
        );
      }

      if (limit) {
        programsForCardsQuery = withLimit(programsForCardsQuery, limit);
      }

      if (offset) {
        programsForCardsQuery = withOffset(programsForCardsQuery, offset);
      }

      programsForCardsQuery = programsForCardsQuery.groupBy(schema.program.id);

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

  getProgramSpotlight: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input: { slug }, ctx: { db, session } }) => {
      const user = session?.user;
      let programQuery = db
        .select({
          ...sharedProgramSelect,
          teachers: programTeachersSelect,
          categories: programCategoriesSelect,
          chapters: programChaptersSelect(Boolean(user)),
          isLikedByUser: isProgramLikedByUserSubquery({
            db,
            userId: user?.id,
          }),
        })
        .from(schema.program)
        .where(eq(schema.program.slug, slug))
        .$dynamic();

      programQuery = programsWithTeachers(programQuery);
      programQuery = programsWithCategories(programQuery);
      programQuery = programsWithChapters(programQuery, user?.id);
      programQuery = programQuery.groupBy(schema.program.id);

      const res = await programQuery.execute();
      const program = res[0];
      if (!program) return null;

      const { chapters, ...rest } = program;
      const sortedByChapterNumber = sortChaptersByChapterNumber(chapters);
      const sortedByLastWatched = sortChaptersByLastWatched(chapters);
      const firstChapter = sortedByChapterNumber?.[0];

      const lastWatchedChapter: LastWatchedChapter = {
        chapterNumber: sortedByLastWatched?.[0]?.chapterNumber,
        slug: sortedByLastWatched?.[0]?.slug,
        watchedDuration:
          sortedByLastWatched?.[0]?.userProgress?.watchedDuration ?? undefined,
      };

      return {
        ...rest,
        chapters: sortedByChapterNumber,
        firstChapter,
        lastWatchedChapter,
      };
    }),

  _getAll: adminProtectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.program.findMany();
  }),

  _getById: adminProtectedProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;
      let programQuery = db
        .select({
          ...sharedProgramSelect,
          published: schema.program.published,
          duration: schema.program.duration,
          teachers: programTeachersSelect,
          categories: programCategoriesSelect,
          chapters: programChaptersSelect(),
        })
        .from(schema.program)
        .where(eq(schema.program.id, id))
        .$dynamic();

      programQuery = programsWithTeachers(programQuery);
      programQuery = programsWithCategories(programQuery);
      programQuery = programsWithChapters(programQuery);
      programQuery = programQuery.groupBy(schema.program.id);

      const res = await programQuery.execute();
      const program = res[0];
      if (!program) return null;

      const { chapters, ...rest } = program;
      const sortedByChapterNumber = sortChaptersByChapterNumber(chapters);

      return {
        ...rest,
        chapters: sortedByChapterNumber,
      };
    }),

  _update: adminProtectedProcedure
    .input(ProgramUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, thumbnail, ...values } = input;

      const [toUpdateProgram] = await db
        .select()
        .from(schema.program)
        .where(eq(schema.program.id, Number(id)));

      if (!toUpdateProgram) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program not found",
        });
      }

      let currentProgramThumbnail = toUpdateProgram.thumbnail;

      if (typeof thumbnail === "string") {
        currentProgramThumbnail = thumbnail;
      }

      if (!thumbnail && currentProgramThumbnail) {
        await deleteFile({ fileName: currentProgramThumbnail });
        currentProgramThumbnail = null;
      }

      const [updatedProgram] = await db
        .update(schema.program)
        .set({
          ...values,
          thumbnail: thumbnail ? currentProgramThumbnail : null,
        })
        .where(eq(schema.program.id, Number(id)))
        .returning();

      if (!updatedProgram) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update program",
        });
      }

      return updatedProgram;
    }),

  _create: adminProtectedProcedure
    .input(ProgramInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { thumbnail, ...values } = input;

      const [createdProgram] = await db
        .insert(schema.program)
        .values({
          ...values,
          thumbnail: typeof thumbnail === "string" ? thumbnail : null,
        })
        .returning();

      return createdProgram;
    }),

  _delete: adminProtectedProcedure
    .input(ProgramDeleteSchema)
    .mutation(async ({ input: { id }, ctx }) => {
      const [program] = await ctx.db
        .select({
          thumbnail: schema.program.thumbnail,
        })
        .from(schema.program)
        .where(eq(schema.program.id, id));

      if (!program) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program not found",
        });
      }

      if (program.thumbnail) {
        await deleteFile({ fileName: program.thumbnail });
      }

      const [deletedProgram] = await ctx.db
        .delete(schema.program)
        .where(eq(schema.program.id, id))
        .returning();

      return deletedProgram;
    }),

  _generateEmbedding: adminProtectedProcedure
    .input(
      z.object({ description: z.string(), title: z.string(), id: z.number() }),
    )
    .mutation(async ({ input: { description, title, id }, ctx }) => {
      const { db } = ctx;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Program ID is required",
        });
      }

      let programQuery = db
        .select({
          categories: programCategoriesSelect,
          teachers: programTeachersSelect,
        })
        .from(schema.program)
        .where(eq(schema.program.id, id))
        .$dynamic();

      programQuery = programsWithTeachers(programQuery);
      programQuery = programsWithCategories(programQuery);
      programQuery = programQuery.groupBy(schema.program.id);

      const [program] = await programQuery.execute();

      if (!program) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program not found!",
        });
      }

      const teachersEmbedding = program?.teachers
        ?.map(({ name }) => name)
        .join(",");

      const categoriesEmbedding = program?.categories
        ?.map(({ name }) => name)
        .join(",");

      let embeddingInput = `${title}|${description}`;

      if (teachersEmbedding) embeddingInput += `|${teachersEmbedding}`;
      if (categoriesEmbedding) embeddingInput += `|${categoriesEmbedding}`;

      const embedding = await generateEmbedding(embeddingInput);

      await db
        .update(schema.program)
        .set({ embedding })
        .where(eq(schema.program.id, id));

      return { success: true };
    }),

  _addTeacher: adminProtectedProcedure
    .input(TeacherProgramInsertSchema)
    .mutation(async ({ input: { programId, teacherId }, ctx: { db } }) => {
      await db.insert(schema.teacherProgram).values({
        programId,
        teacherId,
      });

      return true;
    }),

  _removeTeacher: adminProtectedProcedure
    .input(TeacherProgramInsertSchema)
    .mutation(async ({ input: { programId, teacherId }, ctx: { db } }) => {
      await db
        .delete(schema.teacherProgram)
        .where(
          and(
            eq(schema.teacherProgram.programId, programId),
            eq(schema.teacherProgram.teacherId, teacherId),
          ),
        );

      return true;
    }),

  _addCategory: adminProtectedProcedure
    .input(CategoryProgramInsertSchema)
    .mutation(async ({ input: { programId, categoryId }, ctx: { db } }) => {
      await db.insert(schema.categoryProgram).values({
        programId,
        categoryId,
      });

      return true;
    }),

  _removeCategory: adminProtectedProcedure
    .input(CategoryProgramInsertSchema)
    .mutation(async ({ input: { programId, categoryId }, ctx: { db } }) => {
      await db
        .delete(schema.categoryProgram)
        .where(
          and(
            eq(schema.categoryProgram.programId, programId),
            eq(schema.categoryProgram.categoryId, categoryId),
          ),
        );

      return true;
    }),

  _setChapter: adminProtectedProcedure
    .input(VideoProgramInsertSchema)
    .mutation(
      async ({
        input: { videoId, programId, chapterNumber, isFree },
        ctx: { db },
      }) => {
        await db
          .insert(schema.videoProgram)
          .values({
            programId,
            videoId,
            chapterNumber: chapterNumber || 1,
            isFree: isFree || false,
          })
          .onConflictDoUpdate({
            target: [
              schema.videoProgram.programId,
              schema.videoProgram.videoId,
            ],
            set: {
              chapterNumber: chapterNumber || 1,
              isFree: isFree || false,
            },
          });

        return true;
      },
    ),

  _removeChapter: adminProtectedProcedure
    .input(VideoProgramInsertSchema)
    .mutation(async ({ input: { videoId, programId }, ctx: { db } }) => {
      await db
        .delete(schema.videoProgram)
        .where(
          and(
            eq(schema.videoProgram.programId, programId),
            eq(schema.videoProgram.videoId, videoId),
          ),
        );

      return true;
    }),
});
