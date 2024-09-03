import type { comment } from "@/server/db/schema";
import { z } from "zod";

export type Comment = typeof comment.$inferSelect;

export const CommentInsertSchema = z.object({
  id: z.number().optional(),
  content: z.string().min(1, { message: "Content is required" }),
  videoId: z.number().optional(),
  programId: z.number().optional(),
  shotId: z.number().optional(),
  parentCommentId: z.number().optional(),
});
