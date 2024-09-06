import type { category } from "@/server/db/schema";
import { z } from "zod";

export type Category = typeof category.$inferSelect;

export const CategoryInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const CategoryUpdateSchema = CategoryInsertSchema.extend({
  id: z.number(),
});

export const CategoryDeleteSchema = CategoryUpdateSchema.pick({ id: true });
