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

import { isNumber } from "@/lib/utils/is-number";
import * as schema from "@/server/db/schema";
import {
  type Category,
  CategoryShotInsertSchema,
  ShotInsertSchema,
} from "@/types";
import { generateEmbedding } from "../lib/openai";
import {
  isShotLikedByUserSubquery,
  shotCategoriesSelect,
  shotSelectCarousel,
  shotsWithCategories,
} from "../query-utils/shot.query";

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
      await db.delete(schema.shot).where(eq(schema.shot.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(ShotInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { ...values } = input;

      await db.insert(schema.shot).values({
        ...values,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(ShotInsertSchema)
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
        .update(schema.shot)
        .set({
          ...values,
        })
        .where(eq(schema.shot.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allshots = await db.select().from(schema.shot);
    return allshots;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      let shotQuery = ctx.db
        .select({
          ...getTableColumns(schema.shot),
          categories: sql<Category[]>`json_agg(DISTINCT
            jsonb_build_object(
              'id', ${schema.category.id},
              'name', ${schema.category.name})
           )`,
        })
        .from(schema.shot)
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.where(eq(schema.shot.id, id));

      const shot = await shotQuery.execute();

      return shot[0];
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

      const shotList = await shotQuery.execute();

      return shotList[0];
    }),

  getAllAdmin: adminProtectedProcedure.query(async ({ ctx }) => {
    let shotQuery = ctx.db
      .select({
        ...getTableColumns(schema.shot),
        categories: shotCategoriesSelect,
      })
      .from(schema.shot)
      .$dynamic();

    shotQuery = shotsWithCategories(shotQuery);

    const shotList = await shotQuery.execute();
    return shotList;
  }),

  getLandingPageShots: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.shot.findMany({
      limit: 8,
      columns: {
        playbackId: true,
        slug: true,
        title: true,
      },
      with: {
        categories: true,
      },
    });
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

  addCategory: adminProtectedProcedure
    .input(CategoryShotInsertSchema)
    .mutation(async ({ input: { shotId, categoryId }, ctx: { db } }) => {
      await db.insert(schema.categoryShot).values({
        shotId,
        categoryId,
      });

      return true;
    }),

  removeCategory: adminProtectedProcedure
    .input(CategoryShotInsertSchema)
    .mutation(async ({ input: { shotId, categoryId }, ctx: { db } }) => {
      await db
        .delete(schema.categoryShot)
        .where(
          and(
            eq(schema.categoryShot.shotId, shotId),
            eq(schema.categoryShot.categoryId, categoryId),
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
          categories: shotCategoriesSelect,
        })
        .from(schema.shot)
        .where(eq(schema.shot.id, id))
        .$dynamic();

      shotQuery = shotsWithCategories(shotQuery);
      shotQuery = shotQuery.groupBy(schema.shot.id);
      const shotList = await shotQuery.execute();
      const shot = shotList[0];

      const categoriesEmbedding = shot?.categories
        ?.map(({ name }) => name)
        .join(",");

      let embeddingInput = `${title}|${description}`;

      if (categoriesEmbedding) embeddingInput += `|${categoriesEmbedding}`;

      const embedding = await generateEmbedding(embeddingInput);

      await db
        .update(schema.shot)
        .set({ embedding })
        .where(eq(schema.shot.id, id));

      return { success: true };
    }),
});
