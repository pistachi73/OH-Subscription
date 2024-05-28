import { TRPCError } from "@trpc/server";
import type { SQL } from "drizzle-orm";
import { and, count, desc, eq, lt, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

import { isNumber } from "@/lib/utils";
import { CommentSchema } from "@/schemas";
import { comments, replies, users } from "@/server/db/schema";
import { withLimit } from "../query-utils/shared.query";

export const commentRouter = createTRPCRouter({
  delete: publicProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ input: { commentId }, ctx }) => {
      const { db } = ctx;
      if (!isNumber(commentId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Comment ID is required",
        });
      }

      await db.delete(comments).where(eq(comments.id, commentId));

      return { success: true };
    }),
  create: publicProcedure
    .input(CommentSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { programId, videoId, ...values } = input;

      if (!isNumber(programId) || !isNumber(videoId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Program ID or Video ID is required",
        });
      }

      await db.insert(comments).values({
        ...values,
        ...(programId ? { programId } : {}),
        ...(videoId ? { videoId } : {}),
      });

      return { success: true };
    }),

  update: publicProcedure
    .input(CommentSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      if (!isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Comment ID is required",
        });
      }

      await db
        .update(comments)
        .set({
          ...values,
        })
        .where(eq(comments.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allComments = await db.select().from(comments);
    return allComments;
  }),

  getByProgramIdOrVideoId: publicProcedure
    .input(
      z.object({
        programId: z.number().optional(),
        videoId: z.number().optional(),
        cursor: z.date().nullish(),
        pageSize: z.number().optional(),
      }),
    )
    .query(async ({ input: { videoId, programId, cursor, pageSize }, ctx }) => {
      if (!videoId && !programId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Program ID or Video ID is required",
        });
      }

      let commentsQuery = ctx.db
        .selectDistinctOn([comments.updatedAt], {
          id: comments.id,
          content: comments.content,
          updatedAt: comments.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
          totalReplies: sql<number>`(select count(${replies.content}) from ${replies} where (${replies.commentId} = ${comments.id}))`,
        })
        .from(comments)
        .leftJoin(users, eq(users.id, comments.userId))
        .leftJoin(replies, eq(replies.commentId, comments.id))
        .$dynamic();

      const filterByProgramOrVideoIdClauses = [
        programId ? eq(comments.programId, programId) : null,
        videoId ? eq(comments.videoId, videoId) : null,
      ].filter(Boolean) as SQL<unknown>[];

      const whereClauses = [...filterByProgramOrVideoIdClauses];

      if (cursor) {
        whereClauses.push(lt(comments.updatedAt, cursor));
      }

      commentsQuery = commentsQuery.where(and(...whereClauses));
      commentsQuery = commentsQuery.orderBy(desc(comments.updatedAt));

      if (pageSize) {
        commentsQuery = withLimit(commentsQuery, pageSize);
      }

      const res = await commentsQuery.execute();
      let nextCursor = res.length ? res?.[res.length - 1]?.updatedAt : null;

      if (nextCursor) {
        const nextCursorCount = await ctx.db
          .select({ count: count(comments.id) })
          .from(comments)
          .where(
            and(
              ...filterByProgramOrVideoIdClauses,
              lt(comments.updatedAt, nextCursor),
            ),
          )
          .orderBy(desc(comments.updatedAt))
          .groupBy(comments.updatedAt)
          .execute();

        if (!nextCursorCount[0]?.count) {
          nextCursor = null;
        }
      }

      return {
        comments: res,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;

      const commentList = await db
        .select()
        .from(comments)
        .where(eq(comments.id, id));
      const comment = commentList?.[0];
      return comment;
    }),
});
