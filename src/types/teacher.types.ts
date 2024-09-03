import { z } from "zod";
import type { teacher } from "../server/db/schema/teacher";
import { FileSchema } from "./shared.types";

export type Teacher = typeof teacher.$inferSelect;

export const TeacherInsertSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  bio: z.string().min(1, { message: "Bio is required" }),
  image: FileSchema,
});
