import { TRPCError } from "@trpc/server";
import type { SQL } from "drizzle-orm";
import { and, count, desc, eq, lt, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { isNumber } from "@/lib/utils/is-number";
import * as schema from "@/server/db/schema";
import { CommentInsertSchema } from "@/types";
import { alias } from "drizzle-orm/pg-core";
import { deleteRecursiveComments } from "../lib/comments.lib";
import { withLimit } from "../query-utils/shared.query";

export const commentRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ input: { commentId }, ctx }) => {
      const { db } = ctx;
      if (!isNumber(commentId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Comment ID is required",
        });
      }
      let deletedComments = 1;
      deletedComments = await deleteRecursiveComments({
        db,
        commentId,
        deletedComments,
      });

      return { success: true, deletedComments };
    }),
  create: protectedProcedure
    .input(CommentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db, session } = ctx;
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
        .insert(schema.comment)
        .values({
          ...values,
          ...(programId ? { programId } : {}),
          ...(videoId ? { videoId } : {}),
          ...(shotId ? { shotId } : {}),
          ...(parentCommentId ? { parentCommentId } : {}),
          userId: session.user.id,
        })
        .returning({
          id: schema.comment.id,
          content: schema.comment.content,
          updatedAt: schema.comment.updatedAt,
          likes: schema.comment.likes,
        });
      return { comment: createdComments[0] };
    }),

  update: protectedProcedure
    .input(CommentInsertSchema)
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
        .update(schema.comment)
        .set({
          ...values,
        })
        .where(eq(schema.comment.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allComments = await db.select().from(schema.comment);
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

        const replies = alias(schema.comment, "replies");
        const likedByUserSubquery = sql<boolean>`exists(${ctx.db
          .select({ n: sql`1` })
          .from(schema.like)
          .where(
            and(
              eq(schema.like.commentId, schema.comment.id),
              eq(schema.like.userId, ctx.session?.user?.id ?? ""),
            ),
          )})`.as("likedByUser");

        let commentsQuery = ctx.db
          .selectDistinctOn([schema.comment.updatedAt], {
            id: schema.comment.id,
            content: schema.comment.content,
            updatedAt: schema.comment.updatedAt,
            parentCommentId: schema.comment.parentCommentId,
            likes: schema.comment.likes,
            user: {
              id: schema.user.id,
              name: schema.user.name,
              image: schema.user.image,
            },
            totalReplies: sql<number>`count(${replies.id})`,
            isLikeByUser: likedByUserSubquery,
          })
          .from(schema.comment)
          .leftJoin(replies, eq(replies.parentCommentId, schema.comment.id))
          .leftJoin(schema.user, eq(schema.user.id, schema.comment.userId))
          .groupBy(schema.comment.id, schema.user.id)
          .$dynamic();

        const filterBySourceClauses = [
          programId ? eq(schema.comment.programId, programId) : null,
          videoId ? eq(schema.comment.videoId, videoId) : null,
          shotId ? eq(schema.comment.shotId, shotId) : null,
          parentCommentId
            ? eq(schema.comment.parentCommentId, parentCommentId)
            : null,
        ].filter(Boolean) as SQL<unknown>[];

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
          const nextCursorCount = await ctx.db
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

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;

      const commentList = await db
        .select()
        .from(schema.comment)
        .where(eq(schema.comment.id, id));
      const comment = commentList?.[0];
      return comment;
    }),
});
