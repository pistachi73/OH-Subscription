import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import { isNumber } from "@/lib/utils";
import {
  CategoriesOnProgramsSchema,
  ProgramSchema,
  TeachersOnProgramsSchema,
  VideosOnProgramsSchema,
} from "@/schemas";
import {
  categoriesOnPrograms,
  programs,
  teachersOnPrograms,
  videosOnPrograms,
} from "@/server/db/schema";

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
          thumbnail: thumbnail ? currentProgramThumbnail : null,
        })
        .where(eq(programs.id, Number(id)));

      return { success: true, id: Number(id) };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allPrograms = await db.query.programs.findMany({
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
    });
    return allPrograms;
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
          chapters: true,
        },
      });

      return program;
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
    .mutation(async ({ input: { videoId, programId }, ctx: { db } }) => {
      await db.insert(videosOnPrograms).values({
        programId,
        videoId,
        chapterNumber: 0,
      });

      return true;
    }),

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
