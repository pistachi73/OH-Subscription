import { z } from "zod";

import { comments, likes, programs, shots, videos } from "@/server/db/schema";
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
    input.videoId ? eq(videos.id, input.videoId) : undefined,
    input.programId ? eq(programs.id, input.programId) : undefined,
    input.shotId ? eq(shots.id, input.shotId) : undefined,
    input.commentId ? eq(comments.id, input.commentId) : undefined,
  ];
};

const getAddLikeWhereClauses = (input: z.infer<typeof schema>) => {
  return [
    input.videoId ? eq(likes.videoId, input.videoId) : undefined,
    input.programId ? eq(likes.programId, input.programId) : undefined,
    input.shotId ? eq(likes.shotId, input.shotId) : undefined,
    input.commentId ? eq(likes.commentId, input.commentId) : undefined,
  ];
};

const getLikedSourceTable = (input: z.infer<typeof schema>) => {
  if (input.videoId) return videos;
  if (input.programId) return programs;
  if (input.shotId) return shots;
  return comments;
};

export const likeRouter = createTRPCRouter({
  like: protectedProcedure.input(schema).mutation(async ({ input, ctx }) => {
    const { db, session } = ctx;

    const likedSourceTable = getLikedSourceTable(input);

    await db.transaction(async (tx) => {
      const res = await db
        .select({
          isLike: likes.isLike,
        })
        .from(likes)
        .where(
          and(
            ...getAddLikeWhereClauses(input),
            eq(likes.userId, session.user.id),
          ),
        );

      const isLikedByUser = res?.[0]?.isLike;
      if (isLikedByUser) {
        await tx
          .delete(likes)
          .where(
            and(
              ...getAddLikeWhereClauses(input),
              eq(likes.userId, session.user.id),
            ),
          );
      } else {
        await tx.insert(likes).values({
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
        await tx.insert(likes).values({
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
          .delete(likes)
          .where(
            and(
              ...getAddLikeWhereClauses(input),
              eq(likes.userId, session.user.id),
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
