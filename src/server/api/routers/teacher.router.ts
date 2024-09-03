import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import { isNumber } from "@/lib/utils/is-number";
import * as schema from "@/server/db/schema";
import { TeacherInsertSchema } from "@/types";

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
        .from(schema.teacher)
        .where(eq(schema.teacher.id, id));
      const image = teacher?.[0]?.image;

      if (image) {
        await deleteFile({ fileName: image });
      }

      await db.delete(schema.teacher).where(eq(schema.teacher.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(TeacherInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { image, ...values } = input;

      await db.insert(schema.teacher).values({
        ...values,
        image: typeof image === "string" ? image : null,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(TeacherInsertSchema)
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
        .from(schema.teacher)
        .where(eq(schema.teacher.id, Number(id)));

      let currentTeacherImage = teacher?.[0]?.image;

      if (typeof image === "string") {
        currentTeacherImage = image;
      }

      if (!image && currentTeacherImage) {
        await deleteFile({ fileName: currentTeacherImage });
        currentTeacherImage = null;
      }

      await db
        .update(schema.teacher)
        .set({
          ...values,
          image: image ? currentTeacherImage : null,
        })
        .where(eq(schema.teacher.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allTeachers = await db.select().from(schema.teacher);
    return allTeachers;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;
      const teacher = await db
        .select()
        .from(schema.teacher)
        .where(eq(schema.teacher.id, id));
      return teacher[0];
    }),

  getLandingPageTeachers: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.teacher.findMany({ limit: 7 });
  }),
});
