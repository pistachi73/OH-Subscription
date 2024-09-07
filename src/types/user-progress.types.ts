import type { userProgress } from "@/server/db/schema";
import { z } from "zod";

export type UserProgress = typeof userProgress.$inferSelect;

export const UserProgressInsertSchema = z.object({
  programId: z.number(),
  videoId: z.number(),
  lastWatchedAt: z.date().optional(),
  completed: z.boolean().optional(),
  watchedDuration: z.number().optional(),
  progress: z.number().min(0).max(100).optional(),
});
