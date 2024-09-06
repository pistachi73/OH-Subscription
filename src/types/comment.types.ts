import type { comment } from "@/server/db/schema";
import { z } from "zod";
import { extendBaseSchemasWithSourceId } from "./shared.types";

export type Comment = typeof comment.$inferSelect;

export const CommentInsertSchema = extendBaseSchemasWithSourceId(
  z.object({
    content: z.string().min(1, { message: "Content is required" }),
  }),
);

export const CommentUpdateSchema = z.object({
  id: z.number(),
  content: z.string().min(1, { message: "Content is required" }),
});

export const CommentDeleteSchema = CommentUpdateSchema.pick({ id: true });

export const GetCommentBySourceIdSchema = extendBaseSchemasWithSourceId(
  z.object({
    cursor: z.date().nullish(),
    pageSize: z.number().optional(),
  }),
);
