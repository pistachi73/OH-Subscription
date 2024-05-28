import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, lt } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

import { isNumber } from "@/lib/utils";
import { ReplySchema } from "@/schemas";
import { replies, users } from "@/server/db/schema";

export const replyRouter = createTRPCRouter({
  delete: publicProcedure
    .input(z.object({ replyId: z.number() }))
    .mutation(async ({ input: { replyId }, ctx }) => {
      const { db } = ctx;
      if (!isNumber(replyId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reply ID is required",
        });
      }

      await db.delete(replies).where(eq(replies.id, replyId));

      return { success: true };
    }),
  create: publicProcedure
    .input(ReplySchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { commentId, ...values } = input;

      if (!commentId || !isNumber(commentId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Comment ID  is required",
        });
      }

      const createdReplies = await db
        .insert(replies)
        .values({
          ...values,
          commentId,
        })
        .returning({
          id: replies.id,
          content: replies.content,
          updatedAt: replies.updatedAt,
        });

      return { reply: createdReplies[0] };
    }),

  update: publicProcedure
    .input(ReplySchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      if (!isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reply ID is required",
        });
      }

      await db
        .update(replies)
        .set({
          ...values,
        })
        .where(eq(replies.id, Number(id)));

      return { success: true };
    }),

  getByCommentId: publicProcedure
    .input(
      z.object({
        commentId: z.number(),
        cursor: z.date().nullish(),
        pageSize: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { commentId, pageSize, cursor } = input;

      let replyQuery = ctx.db
        .selectDistinctOn([replies.updatedAt], {
          id: replies.id,
          content: replies.content,
          updatedAt: replies.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
        })
        .from(replies)
        .leftJoin(users, eq(users.id, replies.userId))
        .$dynamic();

      const whereClauses = [eq(replies.commentId, commentId)];
      if (cursor) {
        whereClauses.push(lt(replies.updatedAt, cursor));
      }

      replyQuery = replyQuery.where(and(...whereClauses));
      replyQuery = replyQuery.orderBy(desc(replies.updatedAt));

      if (pageSize) {
        replyQuery = replyQuery.limit(pageSize);
      }

      const res = await replyQuery.execute();
      let nextCursor = res.length ? res?.[res.length - 1]?.updatedAt : null;

      if (nextCursor) {
        const nextCursorCount = await ctx.db
          .select({ count: count(replies.id) })
          .from(replies)
          .where(
            and(
              eq(replies.commentId, commentId),
              lt(replies.updatedAt, nextCursor),
            ),
          )
          .orderBy(desc(replies.updatedAt))
          .groupBy(replies.updatedAt)
          .execute();

        if (!nextCursorCount[0]?.count) {
          nextCursor = null;
        }
      }

      return {
        replies: res,
        nextCursor,
      };
    }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;

      const commentList = await db
        .select()
        .from(replies)
        .where(eq(replies.id, id));
      const comment = commentList?.[0];
      return comment;
    }),
});
