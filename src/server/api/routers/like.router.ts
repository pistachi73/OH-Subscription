import { z } from "zod";

import { comment, like, program, shot, video } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { decrement, increment } from "../query-utils/shared.query";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const schema = z
  .object({
    programId: z.number().optional(),
    videoId: z.number().optional(),
    shotId: z.number().optional(),
    commentId: z.nullable(z.number()).optional(),
  })
  .refine(
    (data) => {
      const keys = Object.entries(data).filter(([_, val]) => Boolean(val));
      return keys.length === 1;
    },
    {
      path: ["zod"],
      message: "Something went wrong, please try again later.",
    },
  );

const getAddLikeCountWhereClauses = (input: z.infer<typeof schema>) => {
  return [
    input.videoId ? eq(video.id, input.videoId) : undefined,
    input.programId ? eq(program.id, input.programId) : undefined,
    input.shotId ? eq(shot.id, input.shotId) : undefined,
    input.commentId ? eq(comment.id, input.commentId) : undefined,
  ];
};

const getAddLikeWhereClauses = (input: z.infer<typeof schema>) => {
  return [
    input.videoId ? eq(like.videoId, input.videoId) : undefined,
    input.programId ? eq(like.programId, input.programId) : undefined,
    input.shotId ? eq(like.shotId, input.shotId) : undefined,
    input.commentId ? eq(like.commentId, input.commentId) : undefined,
  ];
};

const getLikedSourceTable = (input: z.infer<typeof schema>) => {
  if (input.videoId) return video;
  if (input.programId) return program;
  if (input.shotId) return shot;
  return comment;
};

export const likeRouter = createTRPCRouter({
  like: protectedProcedure.input(schema).mutation(async ({ input, ctx }) => {
    const { db, session } = ctx;

    const likedSourceTable = getLikedSourceTable(input);

    await db.transaction(async (tx) => {
      const res = await db
        .select({
          isLike: like.isLike,
        })
        .from(like)
        .where(
          and(
            ...getAddLikeWhereClauses(input),
            eq(like.userId, session.user.id),
          ),
        );

      const isLikedByUser = res?.[0]?.isLike;
      if (isLikedByUser) {
        await tx
          .delete(like)
          .where(
            and(
              ...getAddLikeWhereClauses(input),
              eq(like.userId, session.user.id),
            ),
          );
      } else {
        await tx.insert(like).values({
          userId: session.user.id,
          ...input,
        });
      }

      await tx
        .update(likedSourceTable)
        .set({
          likes: isLikedByUser
            ? decrement(likedSourceTable.likes)
            : increment(likedSourceTable.likes, 1),
        })
        .where(and(...getAddLikeCountWhereClauses(input)));
    });

    return { isLikedByUser: true };
  }),

  likeBySourceId: protectedProcedure
    .input(schema)
    .mutation(async ({ input, ctx }) => {
      const { db, session } = ctx;

      const likedSourceTable = getLikedSourceTable(input);

      await db.transaction(async (tx) => {
        await tx.insert(like).values({
          userId: session.user.id,
          ...input,
        });

        await tx
          .update(likedSourceTable)
          .set({ likes: increment(likedSourceTable.likes, 1) })
          .where(and(...getAddLikeCountWhereClauses(input)));
      });

      return { success: true };
    }),
  unlikeBySourceId: protectedProcedure
    .input(schema)
    .mutation(async ({ input, ctx }) => {
      const { db, session } = ctx;

      const likedSourceTable = getLikedSourceTable(input);

      await db.transaction(async (tx) => {
        await db
          .delete(like)
          .where(
            and(
              ...getAddLikeWhereClauses(input),
              eq(like.userId, session.user.id),
            ),
          );

        await tx
          .update(likedSourceTable)
          .set({ likes: decrement(likedSourceTable.likes) })
          .where(and(...getAddLikeCountWhereClauses(input)));
      });

      return { success: true };
    }),
});
