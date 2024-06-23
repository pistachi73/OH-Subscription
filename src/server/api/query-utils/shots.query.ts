import { categories, categoriesOnShots, shots } from "@/server/db/schema";
import type { Category } from "@/server/db/schema.types";
import { eq, sql } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

export const shotCategoriesSelect = {
  categories: sql<Category[] | null>`
  nullif
    (json_agg(DISTINCT
      nullif(
        jsonb_strip_nulls(
          jsonb_build_object(
            'id', ${categories.id},
            'name', ${categories.name}
          )
        )::jsonb,
      '{}'::jsonb)
    )::jsonb,
  '[null]'::jsonb)`,
};

export const shotSelectCarousel = {
  id: shots.id,
  playbackId: shots.playbackId,
  slug: shots.slug,
  title: shots.title,
  transcript: shots.transcript,
  description: shots.description,
};

export const shotSelect = <T extends PgSelect>(qb: T) => {
  return qb;
};

export const shotsWithCategories = <T extends PgSelect>(qb: T) => {
  return qb
    .leftJoin(categoriesOnShots, eq(shots.id, categoriesOnShots.shotId))
    .leftJoin(categories, eq(categories.id, categoriesOnShots.categoryId));
};
