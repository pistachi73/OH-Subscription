import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { isNumber } from "@/lib/utils/is-number";
import * as schema from "@/server/db/schema";
import { CategoryInsertSchema } from "@/types";

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

      await db.delete(schema.category).where(eq(schema.category.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(CategoryInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { ...values } = input;

      await db.insert(schema.category).values({
        ...values,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(CategoryInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category ID is required",
        });
      }

      await db
        .update(schema.category)
        .set({
          ...values,
        })
        .where(eq(schema.category.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allVideos = await db.select().from(schema.category);
    return allVideos;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;

      const list = await db
        .select()
        .from(schema.category)
        .where(eq(schema.category.id, id));
      const category = list?.[0];
      return category;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input: { slug }, ctx }) => {
      if (!slug) return null;

      const { db } = ctx;

      const list = await db
        .select()
        .from(schema.category)
        .where(eq(schema.category.slug, slug))
        .limit(1);

      const category = list?.[0];
      return category;
    }),
});
