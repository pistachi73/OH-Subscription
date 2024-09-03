import type { shot } from "@/server/db/schema";
import { z } from "zod";

export type Shot = typeof shot.$inferSelect;

export const ShotInsertSchema = z.object({
  id: z.number().optional(),
  playbackId: z.string().min(1, { message: "Playback ID is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  transcript: z.string().optional(),
});
