import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { isNumber } from "@/lib/utils";
import { CategorySchema } from "@/schemas";
import { categories } from "@/server/db/schema";

export const categoryRouter = createTRPCRouter({
  delete: adminProtectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const { db } = ctx;
      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required",
        });
      }

      await db.delete(categories).where(eq(categories.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(CategorySchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { ...values } = input;

      await db.insert(categories).values({
        ...values,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(CategorySchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required",
        });
      }

      await db
        .update(categories)
        .set({
          ...values,
        })
        .where(eq(categories.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allVideos = await db.select().from(categories);
    return allVideos;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;

      const categorieList = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));
      const category = categorieList?.[0];
      return category;
    }),
});
