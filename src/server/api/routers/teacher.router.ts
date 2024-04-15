import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

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

      await db.delete(teachers).where(eq(teachers.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(TeacherSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { name, bio } = input;

      await db.insert(teachers).values({
        name,
        bio,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(TeacherSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { name, bio, id } = input;
      console.log("id", id);
      console.log("isNumber", isNumber(id));
      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Teacher ID is required",
        });
      }

      await db
        .update(teachers)
        .set({
          name,
          bio,
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
