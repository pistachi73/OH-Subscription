import type { categoryShot } from "@/server/db/schema";
import { z } from "zod";

export type CatefgoryShot = typeof categoryShot.$inferSelect;

export const CategoryShotInsertSchema = z.object({
  shotId: z.number(),
  categoryId: z.number(),
});
