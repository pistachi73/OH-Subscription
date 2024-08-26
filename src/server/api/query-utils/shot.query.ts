import { and, eq, sql } from "drizzle-orm";

import type { DB } from "@/server/db";
import { likes, shots } from "@/server/db/schema";

export const isShotLikedByUserSubquery = ({
  db,
  userId,
}: { db: DB; userId?: string }) => {
  if (!userId) return sql<boolean>`false`.as("isLikedByUser");

  return sql<boolean>`exists(${db
    .select({ n: sql`1` })
    .from(likes)
    .where(
      and(eq(likes.videoId, shots.id), eq(likes.userId, userId ?? "")),
    )})`.as("isLikedByUser");
};
