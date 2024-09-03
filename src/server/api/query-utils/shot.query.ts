import { and, eq, sql } from "drizzle-orm";

import type { DB } from "@/server/db";
import { like, shot } from "@/server/db/schema";

import { category, categoryShot } from "@/server/db/schema";
import type { Category } from "@/types";
import type { PgSelect } from "drizzle-orm/pg-core";

export const shotCategoriesSelect = sql<Category[] | null>`json_agg(DISTINCT
jsonb_build_object(
  'id', ${category.id},
  'name', ${category.name},
  'slug', ${category.slug})
) FILTER (WHERE ${category.id} IS NOT NULL)`;

export const shotSelectCarousel = {
  id: shot.id,
  playbackId: shot.playbackId,
  slug: shot.slug,
  title: shot.title,
  transcript: shot.transcript,
  description: shot.description,
};

export const shotSelect = <T extends PgSelect>(qb: T) => {
  return qb;
};

export const shotsWithCategories = <T extends PgSelect>(qb: T) => {
  return qb
    .leftJoin(categoryShot, eq(shot.id, categoryShot.shotId))
    .leftJoin(category, eq(category.id, categoryShot.categoryId));
};

export const isShotLikedByUserSubquery = ({
  db,
  userId,
}: { db: DB; userId?: string }) => {
  if (!userId) return sql<boolean>`false`.as("isLikedByUser");

  return sql<boolean>`exists(${db
    .select({ n: sql`1` })
    .from(like)
    .where(and(eq(like.videoId, shot.id), eq(like.userId, userId ?? "")))})`.as(
    "isLikedByUser",
  );
};
