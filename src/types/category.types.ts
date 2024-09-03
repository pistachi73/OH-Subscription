import type { category } from "@/server/db/schema";
import { z } from "zod";

export type Category = typeof category.$inferSelect;

export const CategoryInsertSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
});
