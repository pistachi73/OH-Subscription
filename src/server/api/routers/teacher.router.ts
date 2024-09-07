import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import * as schema from "@/server/db/schema";
import {
  TeacherDeleteSchema,
  TeacherInsertSchema,
  TeacherUpdateSchema,
} from "@/types";
import { z } from "zod";

export const teacherRouter = createTRPCRouter({
  getTeacherCards: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.teacher.findMany({ limit: 7 });
  }),

  _getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(schema.teacher);
  }),

  _getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;
      const [teacher] = await db
        .select()
        .from(schema.teacher)
        .where(eq(schema.teacher.id, id));

      return teacher;
    }),

  _update: adminProtectedProcedure
    .input(TeacherUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, image, ...values } = input;

      const [toUpdateTeacher] = await db
        .select({
          image: schema.teacher.image,
        })
        .from(schema.teacher)
        .where(eq(schema.teacher.id, Number(id)));

      if (!toUpdateTeacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Teacher not found",
        });
      }

      let currentTeacherImage = toUpdateTeacher.image;

      if (typeof image === "string") {
        currentTeacherImage = image;
      }

      if (!image && currentTeacherImage) {
        await deleteFile({ fileName: currentTeacherImage });
        currentTeacherImage = null;
      }

      const [updatedTeacher] = await db
        .update(schema.teacher)
        .set({
          ...values,
          image: image ? currentTeacherImage : null,
        })
        .where(eq(schema.teacher.id, id))
        .returning();

      return updatedTeacher;
    }),
  _create: adminProtectedProcedure
    .input(TeacherInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { image, ...values } = input;

      const [createdTeacher] = await db
        .insert(schema.teacher)
        .values({
          ...values,
          image: typeof image === "string" ? image : null,
        })
        .returning();

      return createdTeacher;
    }),

  _delete: adminProtectedProcedure
    .input(TeacherDeleteSchema)
    .mutation(async ({ input: { id }, ctx }) => {
      const { db } = ctx;

      const [toDeleteTeacher] = await db
        .select()
        .from(schema.teacher)
        .where(eq(schema.teacher.id, id));

      if (!toDeleteTeacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Teacher not found",
        });
      }

      if (toDeleteTeacher.image) {
        await deleteFile({ fileName: toDeleteTeacher.image });
      }

      const [deletedTeacher] = await db
        .delete(schema.teacher)
        .where(eq(schema.teacher.id, id))
        .returning();

      return deletedTeacher;
    }),
});
