import type { videoProgram } from "@/server/db/schema";
import { z } from "zod";

export type VideoProgram = typeof videoProgram.$inferSelect;

export const VideoProgramInsertSchema = z.object({
  programId: z.number(),
  videoId: z.number(),
  chapterNumber: z.number().optional(),
  isFree: z.boolean().optional(),
});
