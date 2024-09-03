import type { categoryProgram } from "@/server/db/schema";
import { z } from "zod";

export type CategoryProgram = typeof categoryProgram.$inferSelect;

export const CategoryProgramInsertSchema = z.object({
  programId: z.number(),
  categoryId: z.number(),
});
