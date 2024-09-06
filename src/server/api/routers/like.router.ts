import type { z } from "zod";

import { comment, like, program, shot, video } from "@/server/db/schema";
import {
  isFromCommentSource,
  isFromProgramSource,
  isFromShotSource,
  isFromVideoSource,
} from "@/types";
import { LikeBySourceIdSchema } from "@/types/like.type";
import { and, eq } from "drizzle-orm";
import { decrement, increment } from "../query-utils/shared.query";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const getAddLikeCountWhereClauses = (
  input: z.infer<typeof LikeBySourceIdSchema>,
) => {
  return [
    isFromProgramSource(input) ? eq(program.id, input.programId) : undefined,
    isFromVideoSource(input) ? eq(video.id, input.videoId) : undefined,
    isFromShotSource(input) ? eq(shot.id, input.shotId) : undefined,
    isFromCommentSource(input) ? eq(comment.id, input.commentId) : undefined,
  ];
};

const getAddLikeWhereClauses = (
  input: z.infer<typeof LikeBySourceIdSchema>,
) => {
  return [
    isFromProgramSource(input)
      ? eq(like.programId, input.programId)
      : undefined,
    isFromVideoSource(input) ? eq(like.videoId, input.videoId) : undefined,
    isFromShotSource(input) ? eq(like.shotId, input.shotId) : undefined,
    isFromCommentSource(input)
      ? eq(like.commentId, input.commentId)
      : undefined,
  ];
};

const getLikedSourceTable = (input: z.infer<typeof LikeBySourceIdSchema>) => {
  if (isFromProgramSource(input)) return program;
  if (isFromVideoSource(input)) return video;
  if (isFromShotSource(input)) return shot;
  return comment;
};

export const likeRouter = createTRPCRouter({
  likeBySourceId: protectedProcedure
    .input(LikeBySourceIdSchema)
    .mutation(async ({ input, ctx }) => {
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
});
