import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import { isNumber } from "@/lib/utils";
import { TeacherSchema } from "@/schemas";
import { teachers } from "@/server/db/schema";

export const teacherRouter = createTRPCRouter({
  delete: adminProtectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const { db } = ctx;
      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Teacher ID is required",
        });
      }

      const teacher = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, id));
      const image = teacher?.[0]?.image;

      if (image) {
        await deleteFile({ fileName: image });
      }

      await db.delete(teachers).where(eq(teachers.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(TeacherSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { image, ...values } = input;

      await db.insert(teachers).values({
        ...values,
        image: typeof image === "string" ? image : null,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(TeacherSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, image, ...values } = input;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Teacher ID is required",
        });
      }

      const teacher = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, Number(id)));

      let currentTeacherImage = teacher?.[0]?.image;

      if (typeof image === "string") {
        currentTeacherImage = image;
      }

      if (!image && currentTeacherImage) {
        await deleteFile({ fileName: currentTeacherImage });
        currentTeacherImage = null;
      }

      await db
        .update(teachers)
        .set({
          ...values,
          image: image ? currentTeacherImage : null,
        })
        .where(eq(teachers.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allTeachers = await db.select().from(teachers);
    return allTeachers;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;
      const teacher = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, id));
      return teacher[0];
    }),
});
