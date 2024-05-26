import { TRPCError } from "@trpc/server";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { isNumber } from "@/lib/utils";
import { CommentSchema } from "@/schemas";
import { comments, users } from "@/server/db/schema";
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

  update: adminProtectedProcedure
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

  getByProgramId: publicProcedure
    .input(
      z.object({
        programId: z.number(),
        cursor: z.number().optional(),
        pageSize: z.number().optional(),
      }),
    )
    .query(async ({ input: { programId, cursor, pageSize }, ctx }) => {
      let commentsQuery = ctx.db
        .select({
          id: comments.id,
          content: comments.content,
          updatedAt: comments.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
        })
        .from(comments)
        .leftJoin(users, eq(users.id, comments.userId))
        .where(eq(comments.programId, programId))
        .$dynamic();

      const whereClauses = [eq(comments.programId, programId)];
      if (cursor) {
        whereClauses.push(gt(comments.id, cursor));
      }

      commentsQuery = commentsQuery.where(and(...whereClauses));

      if (pageSize) {
        commentsQuery = withLimit(commentsQuery, pageSize);
      }

      const res = await commentsQuery.execute();

      return {
        comments: res,
        nextCursor: res[res.length - 1]?.id ?? null,
      };
    }),

  getByVideoId: publicProcedure
    .input(z.object({ videoId: z.number(), limit: z.number().optional() }))
    .query(async ({ input: { videoId, limit }, ctx }) => {
      let commentsQuery = ctx.db
        .select({
          id: comments.id,
          content: comments.content,
          updatedAt: comments.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
        })
        .from(comments)
        .leftJoin(users, eq(users.id, comments.userId))
        .where(eq(comments.videoId, videoId))
        .$dynamic();

      if (limit) {
        commentsQuery = withLimit(commentsQuery, limit);
      }

      return await commentsQuery.execute();
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
