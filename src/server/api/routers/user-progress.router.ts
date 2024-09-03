import { userProgress } from "@/server/db/schema";
import { UserProgressInsertSchema } from "@/types";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userProgressRouter = createTRPCRouter({
  setProgress: protectedProcedure
    .input(UserProgressInsertSchema)
    .mutation(async ({ input, ctx }) => {
      if (!input.userId || !input.programId || !input.videoId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User ID, Program ID, and Video ID are required",
        });
      }

      await ctx.db
        .insert(userProgress)
        .values(input)
        .onConflictDoUpdate({
          target: [
            userProgress.userId,
            userProgress.programId,
            userProgress.videoId,
          ],
          set: {
            lastWatchedAt: input.lastWatchedAt,
            completed: input.completed,
            watchedDuration: input.watchedDuration,
            progress: input.progress,
          },
        });
    }),
});
