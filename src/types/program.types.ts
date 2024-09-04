import type { program } from "@/server/db/schema";
import { z } from "zod";
import { FileSchema } from "./shared.types";

export type Program = typeof program.$inferSelect;
export type ProgramLevel = Program["level"];

export const ProgramInsertSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  published: z.boolean(),
  thumbnail: FileSchema,
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    required_error: "Level is required",
  }),
  totalChapters: z
    .number({ required_error: "Total chapters is required" })
    .min(1, { message: "Must be greater than 0" }),
  duration: z
    .number({ required_error: "Duration is required" })
    .min(1, { message: "Must be greater than 0" }),
});

export const ProgramUpdateSchema = ProgramInsertSchema.extend({
  id: z.number(),
});

export const ProgramDeleteSchema = ProgramUpdateSchema.pick({ id: true });
