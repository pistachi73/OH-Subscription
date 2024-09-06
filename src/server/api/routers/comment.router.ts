import { and, count, desc, eq, lt, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import * as schema from "@/server/db/schema";
import {
  CommentDeleteSchema,
  CommentInsertSchema,
  CommentUpdateSchema,
  GetCommentBySourceIdSchema,
  isFromCommentSource,
  isFromProgramSource,
  isFromShotSource,
  isFromVideoSource,
} from "@/types";
import { alias } from "drizzle-orm/pg-core";
import { deleteRecursiveComments } from "../lib/comments.lib";
import {
  commentRepliesAlias,
  commentSelect,
  commentTotalRepliesSelect,
  commentUserSelect,
  isCommentLikedByUserSubquery,
} from "../query-utils/comment.query";
import { withLimit } from "../query-utils/shared.query";

export const commentRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(CommentDeleteSchema)
    .mutation(async ({ input: { id }, ctx }) => {
      let numberOfDeletedComments = 1;
      numberOfDeletedComments = await deleteRecursiveComments({
        db: ctx.db,
        commentId: id,
        numberOfDeletedComments,
      });

      return { numberOfDeletedComments };
    }),

  create: protectedProcedure
    .input(CommentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db, session } = ctx;

      const values = {
        userId: session.user.id,
        content: input.content,
        ...(isFromProgramSource(input) && { programId: input.programId }),
        ...(isFromVideoSource(input) && { videoId: input.videoId }),
        ...(isFromShotSource(input) && { shotId: input.shotId }),
        ...(isFromCommentSource(input) && {
          parentCommentId: input.commentId,
        }),
      };

      const [createdComment] = await db
        .insert(schema.comment)
        .values(values)
        .returning();

      return createdComment;
    }),

  update: protectedProcedure
    .input(CommentUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      const [udpatedComment] = await db
        .update(schema.comment)
        .set({
          ...values,
        })
        .where(eq(schema.comment.id, Number(id)))
        .returning();

      return udpatedComment;
    }),

  getCommentsBySourceId: publicProcedure
    .input(GetCommentBySourceIdSchema)
    .query(async ({ input, ctx }) => {
      const { pageSize, cursor } = input;

      let commentsQuery = ctx.db
        .selectDistinctOn([schema.comment.updatedAt], {
          ...commentSelect,
          user: commentUserSelect,
          totalReplies: commentTotalRepliesSelect,
          isLikeByUser: isCommentLikedByUserSubquery({
            db: ctx.db,
            userId: ctx.session?.user?.id,
          }),
        })
        .from(schema.comment)
        .leftJoin(
          commentRepliesAlias,
          eq(commentRepliesAlias.parentCommentId, schema.comment.id),
        )
        .leftJoin(schema.user, eq(schema.user.id, schema.comment.userId))
        .groupBy(schema.comment.id, schema.user.id)
        .$dynamic();

      const filterBySourceClauses = [
        isFromProgramSource(input)
          ? eq(schema.comment.programId, input.programId)
          : undefined,
        isFromVideoSource(input)
          ? eq(schema.comment.videoId, input.videoId)
          : undefined,
        isFromShotSource(input)
          ? eq(schema.comment.shotId, input.shotId)
          : undefined,
        isFromCommentSource(input)
          ? eq(schema.comment.parentCommentId, input.commentId)
          : undefined,
      ];

      const whereClauses = [...filterBySourceClauses];

      if (cursor) {
        whereClauses.push(lt(schema.comment.updatedAt, cursor));
      }

      commentsQuery = commentsQuery.where(and(...whereClauses));
      commentsQuery = commentsQuery.orderBy(desc(schema.comment.updatedAt));

      if (pageSize) {
        commentsQuery = withLimit(commentsQuery, pageSize);
      }

      const res = await commentsQuery.execute();
      let nextCursor = res.length ? res?.[res.length - 1]?.updatedAt : null;

      if (nextCursor) {
        const [nextCursorCount] = await ctx.db
          .select({ count: count(schema.comment.id) })
          .from(schema.comment)
          .where(
            and(
              ...filterBySourceClauses,
              lt(schema.comment.updatedAt, nextCursor),
            ),
          )
          .orderBy(desc(schema.comment.updatedAt))
          .groupBy(schema.comment.updatedAt)
          .execute();

        if (!nextCursorCount?.count) {
          nextCursor = null;
        }
      }

      return {
        comments: res,
        nextCursor,
      };
    }),

  getTotalCommentsBySourceId: publicProcedure
    .input(
      z.object({
        videoId: z.number().optional(),
        programId: z.number().optional(),
        shotId: z.number().optional(),
      }),
    )
    .query(async ({ input: { videoId, programId, shotId }, ctx }) => {
      if (!videoId && !programId && !shotId) return null;

      const replies = alias(schema.comment, "replies");
      let commentsQuery = ctx.db
        .select({
          totalReplies: sql<number>`count(${replies.id})`,
        })
        .from(schema.comment)
        .leftJoin(replies, eq(replies.parentCommentId, schema.comment.id))
        .$dynamic();

      const whereClauses = [
        videoId ? eq(schema.comment.videoId, videoId) : undefined,
        programId ? eq(schema.comment.programId, programId) : undefined,
        shotId ? eq(schema.comment.shotId, shotId) : undefined,
      ];

      commentsQuery = commentsQuery.where(and(...whereClauses));
      commentsQuery = commentsQuery.groupBy(schema.comment.id);
      const resComments = await commentsQuery.execute();

      console.log({ resComments });

      const commentsCount = resComments.reduce((acc, curr) => {
        return acc + Number(curr.totalReplies) + 1;
      }, 0);

      return commentsCount ?? null;
    }),
});
