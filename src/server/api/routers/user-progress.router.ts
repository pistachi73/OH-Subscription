import { userProgress } from "@/server/db/schema";
import { UserProgressInsertSchema } from "@/types";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userProgressRouter = createTRPCRouter({
  setProgress: protectedProcedure
    .input(UserProgressInsertSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .insert(userProgress)
        .values({ userId: ctx.session.user.id, ...input })
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
