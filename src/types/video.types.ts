import type { video } from "@/server/db/schema/video";
import { z } from "zod";
import { FileSchema } from "./shared.types";

export type Video = typeof video.$inferSelect;

export const VideoInsertSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  url: z.string().min(1, { message: "URL is required" }),
  duration: z.number().min(1, { message: "Duration is required" }),
  transcript: z.string().optional(),
  thumbnail: FileSchema,
});
