import { TRPCError } from "@trpc/server";
import type { SQL } from "drizzle-orm";
import { and, count, desc, eq, lt, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

import { isNumber } from "@/lib/utils";
import { CommentSchema } from "@/schemas";
import { comments, users } from "@/server/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { deleteRecursiveComments } from "../lib/comments.lib";
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

      await deleteRecursiveComments({
        db,
        commentId,
      });

      return { success: true };
    }),
  create: publicProcedure
    .input(CommentSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { programId, videoId, shotId, parentCommentId, ...values } = input;

      if (
        !isNumber(programId) ||
        !isNumber(videoId) ||
        !isNumber(shotId) ||
        !isNumber(parentCommentId)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Program ID or Video ID or Shot ID or Parent Comment ID is required",
        });
      }

      const createdComments = await db
        .insert(comments)
        .values({
          ...values,
          ...(programId ? { programId } : {}),
          ...(videoId ? { videoId } : {}),
          ...(shotId ? { shotId } : {}),
          ...(parentCommentId ? { parentCommentId } : {}),
        })
        .returning({
          id: comments.id,
          content: comments.content,
          updatedAt: comments.updatedAt,
        });
      return { comment: createdComments[0] };
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

  getBySourceId: publicProcedure
    .input(
      z.object({
        programId: z.number().optional(),
        videoId: z.number().optional(),
        shotId: z.number().optional(),
        parentCommentId: z.nullable(z.number()).optional(),
        cursor: z.date().nullish(),
        pageSize: z.number().optional(),
      }),
    )
    .query(
      async ({
        input: {
          videoId,
          programId,
          shotId,
          parentCommentId,
          cursor,
          pageSize,
        },
        ctx,
      }) => {
        if (!videoId && !programId && !shotId && !parentCommentId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Program ID or Video ID or Shot ID is required",
          });
        }

        const replies = alias(comments, "replies");
        let commentsQuery = ctx.db
          .selectDistinctOn([comments.updatedAt], {
            id: comments.id,
            content: comments.content,
            updatedAt: comments.updatedAt,
            parentCommentId: comments.parentCommentId,
            user: {
              id: users.id,
              name: users.name,
              image: users.image,
            },
            totalReplies: sql<number>`count(${replies.id})`,
          })
          .from(comments)
          .leftJoin(replies, eq(replies.parentCommentId, comments.id))
          .leftJoin(users, eq(users.id, comments.userId))
          .groupBy(comments.id, users.id)
          .$dynamic();

        const filterBySourceClauses = [
          programId ? eq(comments.programId, programId) : null,
          videoId ? eq(comments.videoId, videoId) : null,
          shotId ? eq(comments.shotId, shotId) : null,
          parentCommentId
            ? eq(comments.parentCommentId, parentCommentId)
            : null,
        ].filter(Boolean) as SQL<unknown>[];

        const whereClauses = [...filterBySourceClauses];

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
              and(...filterBySourceClauses, lt(comments.updatedAt, nextCursor)),
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
      },
    ),

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
