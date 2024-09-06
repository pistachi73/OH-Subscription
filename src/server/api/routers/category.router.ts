import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import * as schema from "@/server/db/schema";
import {
  CategoryDeleteSchema,
  CategoryInsertSchema,
  CategoryUpdateSchema,
} from "@/types";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input: { slug }, ctx }) => {
      const { db } = ctx;

      const [category] = await db
        .select()
        .from(schema.category)
        .where(eq(schema.category.slug, slug))
        .limit(1);

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(schema.category);
  }),

  _getById: adminProtectedProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const [category] = await ctx.db
        .select()
        .from(schema.category)
        .where(eq(schema.category.id, id));

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),
  _update: adminProtectedProcedure
    .input(CategoryUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      const [updatedCategory] = await db
        .update(schema.category)
        .set({
          ...values,
        })
        .where(eq(schema.category.id, Number(id)))
        .returning();

      return updatedCategory;
    }),

  _create: adminProtectedProcedure
    .input(CategoryInsertSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.insert(schema.category).values(input).returning();
    }),

  _delete: adminProtectedProcedure
    .input(CategoryDeleteSchema)
    .mutation(async ({ input: { id }, ctx }) => {
      const [deletedCategory] = await ctx.db
        .delete(schema.category)
        .where(eq(schema.category.id, id))
        .returning();
      return deletedCategory;
    }),
});
