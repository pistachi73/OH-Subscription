import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { toKebabCase } from "@/lib/case-converters";
import { isNumber } from "@/lib/utils";
import { CategoriesOnShotsSchema, ShotSchema } from "@/schemas";
import { categories, categoriesOnShots, shots } from "@/server/db/schema";
import type { Category } from "@/server/db/schema.types";
import { withLimit } from "../query-utils/shared.query";
import { shotsWithCategories } from "../query-utils/shots.query";

export const shotRouter = createTRPCRouter({
  delete: adminProtectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const { db } = ctx;
      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "shot ID is required",
        });
      }
      await db.delete(shots).where(eq(shots.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(ShotSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { ...values } = input;

      await db.insert(shots).values({
        ...values,
        slug: toKebabCase(values.title) as string,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(ShotSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "shot ID is required",
        });
      }

      await db
        .update(shots)
        .set({
          ...values,
          slug: toKebabCase(values.title) as string,
        })
        .where(eq(shots.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allshots = await db.select().from(shots);
    return allshots;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      let shotQuery = ctx.db
        .select({
          ...getTableColumns(shots),
          categories: sql<Category[]>`json_agg(DISTINCT
            jsonb_build_object(
              'id', ${categories.id},
              'name', ${categories.name})
           )`,
        })
        .from(shots)
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.where(eq(shots.id, id));

      const shot = await shotQuery.execute();

      return shot[0];
    }),

  getByIdAdmin: adminProtectedProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { slug, createdAt, updatedAt, ...rest } = getTableColumns(shots);

      let shotQuery = ctx.db
        .select({
          ...rest,
          categories: sql<Category[]>`json_agg(DISTINCT
              jsonb_build_object(
                'id', ${categories.id},
                'name', ${categories.name})
             )`,
        })
        .from(shots)
        .where(eq(shots.id, id))
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.groupBy(shots.id);

      const shot = await shotQuery.execute();

      return shot[0];
    }),

  getAllAdmin: adminProtectedProcedure.query(async ({ ctx }) => {
    let shotQuery = ctx.db
      .select({
        ...getTableColumns(shots),
        categories: sql<Category[]>`json_agg(DISTINCT
        jsonb_build_object(
          'id', ${categories.id},
          'name', ${categories.name})
       )`,
      })
      .from(shots)
      .$dynamic();

    shotQuery = shotsWithCategories(shotQuery);

    const shotList = await shotQuery.execute();
    return shotList;
  }),

  getShotForCards: publicProcedure.query(async ({ ctx }) => {
    let shotQuery = ctx.db
      .select({
        playbackId: shots.playbackId,
        slug: shots.slug,
        title: shots.title,
        categories: sql<Category[]>`json_agg(DISTINCT
        jsonb_build_object(
          'id', ${categories.id},
          'name', ${categories.name})
       )`,
      })
      .from(shots)
      .$dynamic();

    shotQuery = shotsWithCategories(shotQuery);
    shotQuery = shotQuery.groupBy(shots.id);
    shotQuery = withLimit(shotQuery, 6);

    const allShots = await shotQuery.execute();

    return allShots;
  }),

  addCategory: adminProtectedProcedure
    .input(CategoriesOnShotsSchema)
    .mutation(async ({ input: { shotId, categoryId }, ctx: { db } }) => {
      await db.insert(categoriesOnShots).values({
        shotId,
        categoryId,
      });

      return true;
    }),

  removeCategory: adminProtectedProcedure
    .input(CategoriesOnShotsSchema)
    .mutation(async ({ input: { shotId, categoryId }, ctx: { db } }) => {
      await db
        .delete(categoriesOnShots)
        .where(
          and(
            eq(categoriesOnShots.shotId, shotId),
            eq(categoriesOnShots.categoryId, categoryId),
          ),
        );

      return true;
    }),
});
