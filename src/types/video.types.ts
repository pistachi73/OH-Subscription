import type { video } from "@/server/db/schema/video";
import { z } from "zod";
import { FileSchema } from "./shared.types";

export type Video = typeof video.$inferSelect;

export const VideoInsertSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  playbackId: z.string().min(1, { message: "PlaybackId is required" }),
  duration: z.number().min(1, { message: "Duration is required" }),
  transcript: z.string().optional(),
  thumbnail: FileSchema,
});

export const VideoUpdateSchema = VideoInsertSchema.extend({
  id: z.number(),
});

export const VideoDeleteSchema = VideoUpdateSchema.pick({ id: true });
