import { TRPCError } from "@trpc/server";
import {
  and,
  cosineDistance,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  lt,
  ne,
  sql,
} from "drizzle-orm";
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
import { generateEmbedding } from "../lib/openai";
import { withLimit } from "../query-utils/shared.query";
import {
  shotCategoriesSelect,
  shotSelectCarousel,
  shotsWithCategories,
} from "../query-utils/shots.query";

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
          categories: sql<Category[] | null>`nullif(json_agg(DISTINCT
              nullif(jsonb_strip_nulls(jsonb_build_object(
                'id', ${categories.id},
                'name', ${categories.name}))::jsonb, '{}'::jsonb)
        )::jsonb, '[null]'::jsonb)`,
        })
        .from(shots)
        .where(eq(shots.id, id))
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.groupBy(shots.id);

      const shotList = await shotQuery.execute();

      return shotList[0];
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
        ...shotCategoriesSelect,
      })
      .from(shots)
      .$dynamic();

    shotQuery = shotsWithCategories(shotQuery);
    shotQuery = shotQuery.groupBy(shots.id);
    shotQuery = withLimit(shotQuery, 6);

    const allShots = await shotQuery.execute();

    return allShots;
  }),

  getInitialCarouselShot: publicProcedure
    .input(
      z.object({
        initialShotSlug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let initialShotQuery = ctx.db
        .select({
          ...shotSelectCarousel,
          ...shotCategoriesSelect,
        })
        .from(shots)
        .where(eq(shots.slug, input.initialShotSlug))
        .$dynamic();

      initialShotQuery = shotsWithCategories(initialShotQuery);
      initialShotQuery = initialShotQuery.groupBy(shots.id);
      const initialShot = (await initialShotQuery.execute())[0];

      if (!initialShot) return null;

      const embedding = await generateEmbedding(initialShot.title);

      return { shot: initialShot, embedding };
    }),
  getCarouselShots: publicProcedure
    .input(
      z.object({
        initialShotSlug: z.string(),
        initialShotTitle: z.string(),
        cursor: z.number().nullish(),
        pageSize: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { initialShotTitle, cursor } = input;

      const embedding = await generateEmbedding(initialShotTitle);

      const similarity = sql<number>`1 - (${cosineDistance(
        shots.embedding,
        embedding,
      )})`;

      const whereClauses = [
        gt(similarity, 0.5),
        ne(shots.slug, input.initialShotSlug),
      ];

      if (cursor) {
        whereClauses.push(lt(similarity, cursor));
      }

      let shotQuery = ctx.db
        .select({
          id: shots.id,
          playbackId: shots.playbackId,
          slug: shots.slug,
          title: shots.title,
          transcript: shots.transcript,
          description: shots.description,
          similarity,
          ...shotCategoriesSelect,
        })
        .from(shots)
        .where(and(...whereClauses))
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.groupBy(shots.id);
      shotQuery = shotQuery.orderBy((t) => desc(t.similarity));
      shotQuery = shotQuery.limit(input.pageSize ?? 3);
      const shotList = await shotQuery.execute();

      let nextCursor = shotList.length
        ? shotList?.[shotList.length - 1]?.similarity
        : null;

      if (nextCursor) {
        const nextCursorCount = await ctx.db
          .select({ count: count(shots.id) })
          .from(shots)
          .where(and(...whereClauses, lt(similarity, nextCursor)))
          .groupBy(shots.id)
          .execute();

        if (!nextCursorCount[0]?.count) {
          nextCursor = null;
        }
      }

      return {
        shots: shotList,
        nextCursor,
      };
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

  generateEmbedding: adminProtectedProcedure
    .input(
      z.object({ description: z.string(), title: z.string(), id: z.number() }),
    )
    .mutation(async ({ input: { description, title, id }, ctx }) => {
      const { db } = ctx;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Shot ID is required",
        });
      }

      let shotQuery = db
        .select({
          ...shotCategoriesSelect,
        })
        .from(shots)
        .where(eq(shots.id, id))
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.groupBy(shots.id);
      const shotList = await shotQuery.execute();
      const shot = shotList[0];

      const categoriesEmbedding = shot?.categories
        ?.map(({ name }) => name)
        .join(",");

      let embeddingInput = `${title}|${description}`;

      if (categoriesEmbedding) embeddingInput += `|${categoriesEmbedding}`;

      const embedding = await generateEmbedding(embeddingInput);

      await db.update(shots).set({ embedding }).where(eq(shots.id, id));

      return { success: true };
    }),
});
