import { categories, categoriesOnShots, shots } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

export const shotsWithCategories = <T extends PgSelect>(qb: T) => {
  return qb
    .leftJoin(categoriesOnShots, eq(shots.id, categoriesOnShots.shotId))
    .leftJoin(categories, eq(categories.id, categoriesOnShots.categoryId));
};
