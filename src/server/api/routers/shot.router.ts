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

import * as schema from "@/server/db/schema";
import {
  CategoryShotInsertSchema,
  ShotDeleteSchema,
  ShotInsertSchema,
  ShotUpdateSchema,
} from "@/types";
import { TRPCError } from "@trpc/server";
import { generateEmbedding } from "../lib/openai";
import {
  isShotLikedByUserSubquery,
  shotCategoriesSelect,
  shotSelectCarousel,
  shotsWithCategories,
} from "../query-utils/shot.query";

export const shotRouter = createTRPCRouter({
  getShotCards: publicProcedure.query(async ({ ctx }) => {
    let shotCardsQuery = ctx.db
      .select({
        slug: schema.shot.slug,
        title: schema.shot.title,
        playbackId: schema.shot.playbackId,
        categories: shotCategoriesSelect,
      })
      .from(schema.shot)
      .$dynamic();

    shotCardsQuery = shotsWithCategories(shotCardsQuery);
    shotCardsQuery = shotCardsQuery.groupBy(schema.shot.id);

    const shots = await shotCardsQuery.execute();

    return shots;
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
          categories: shotCategoriesSelect,
          isLikedByUser: isShotLikedByUserSubquery({
            db: ctx.db,
            userId: ctx.session?.user?.id,
          }),
        })
        .from(schema.shot)
        .where(eq(schema.shot.slug, input.initialShotSlug))
        .$dynamic();

      initialShotQuery = shotsWithCategories(initialShotQuery);
      initialShotQuery = initialShotQuery.groupBy(schema.shot.id);

      const [initialShot] = await initialShotQuery.execute();
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
      let embedding: number[] = [];

      try {
        embedding = await generateEmbedding(initialShotTitle);
      } catch (e) {
        console.error("Could not generate embedding");
      }

      const similarity = sql<number>`1 - (${cosineDistance(
        schema.shot.embedding,
        embedding,
      )})`;

      const whereClauses = [
        gt(similarity, 0.5),
        ne(schema.shot.slug, input.initialShotSlug),
      ];

      if (cursor) {
        whereClauses.push(lt(similarity, cursor));
      }

      let shotQuery = ctx.db
        .select({
          ...shotSelectCarousel,
          categories: shotCategoriesSelect,
          similarity,
          isLikedByUser: isShotLikedByUserSubquery({
            db: ctx.db,
            userId: ctx.session?.user?.id,
          }),
        })
        .from(schema.shot)
        .where(and(...whereClauses))
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.groupBy(schema.shot.id);
      shotQuery = shotQuery.orderBy((t) => desc(t.similarity));
      shotQuery = shotQuery.limit(input.pageSize ?? 3);
      const shotList = await shotQuery.execute();

      let nextCursor = shotList.length
        ? shotList?.[shotList.length - 1]?.similarity
        : null;

      if (nextCursor) {
        const nextCursorCount = await ctx.db
          .select({ count: count(schema.shot.id) })
          .from(schema.shot)
          .where(and(...whereClauses, lt(similarity, nextCursor)))
          .groupBy(schema.shot.id)
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

  _getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(schema.shot);
  }),

  _getById: adminProtectedProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { slug, createdAt, updatedAt, ...rest } = getTableColumns(
        schema.shot,
      );

      let shotQuery = ctx.db
        .select({
          ...rest,
          categories: shotCategoriesSelect,
        })
        .from(schema.shot)
        .where(eq(schema.shot.id, id))
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.groupBy(schema.shot.id);

      const [shot] = await shotQuery.execute();

      if (!shot)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shot not found",
        });

      return shot;
    }),

  _update: adminProtectedProcedure
    .input(ShotUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      await db
        .update(schema.shot)
        .set({
          ...values,
        })
        .where(eq(schema.shot.id, Number(id)));

      return { success: true };
    }),

  _create: adminProtectedProcedure
    .input(ShotInsertSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.insert(schema.shot).values(input).returning();
    }),

  _delete: adminProtectedProcedure
    .input(ShotDeleteSchema)
    .mutation(async ({ input: { id }, ctx }) => {
      return await ctx.db
        .delete(schema.shot)
        .where(eq(schema.shot.id, id))
        .returning();
    }),

  _addCategory: adminProtectedProcedure
    .input(CategoryShotInsertSchema)
    .mutation(async ({ input: { shotId, categoryId }, ctx: { db } }) => {
      return await db
        .insert(schema.categoryShot)
        .values({
          shotId,
          categoryId,
        })
        .returning();
    }),

  _removeCategory: adminProtectedProcedure
    .input(CategoryShotInsertSchema)
    .mutation(async ({ input: { shotId, categoryId }, ctx: { db } }) => {
      return await db
        .delete(schema.categoryShot)
        .where(
          and(
            eq(schema.categoryShot.shotId, shotId),
            eq(schema.categoryShot.categoryId, categoryId),
          ),
        )
        .returning();
    }),

  _generateEmbedding: adminProtectedProcedure
    .input(
      z.object({ description: z.string(), title: z.string(), id: z.number() }),
    )
    .mutation(async ({ input: { description, title, id }, ctx }) => {
      const { db } = ctx;

      let shotQuery = db
        .select({
          categories: shotCategoriesSelect,
        })
        .from(schema.shot)
        .where(eq(schema.shot.id, id))
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.groupBy(schema.shot.id);

      const [shot] = await shotQuery.execute();

      if (!shot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shot not found",
        });
      }

      const categoriesEmbedding = shot?.categories
        ?.map(({ name }) => name)
        .join(",");

      let embeddingInput = `${title}|${description}`;
      if (categoriesEmbedding) embeddingInput += `|${categoriesEmbedding}`;

      let embedding: number[];
      try {
        embedding = await generateEmbedding(embeddingInput);
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not generate embedding",
        });
      }

      await db
        .update(schema.shot)
        .set({ embedding })
        .where(eq(schema.shot.id, id));

      return { success: true };
    }),
});
