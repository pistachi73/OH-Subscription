import { UserProgressSchema } from "@/schemas";
import { userProgresses } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userProgressRouter = createTRPCRouter({
  setProgress: protectedProcedure
    .input(UserProgressSchema)
    .mutation(async ({ input, ctx }) => {
      if (!input.userId || !input.programId || !input.videoId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User ID, Program ID, and Video ID are required",
        });
      }

      await ctx.db
        .insert(userProgresses)
        .values(input)
        .onConflictDoUpdate({
          target: [
            userProgresses.userId,
            userProgresses.programId,
            userProgresses.videoId,
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
