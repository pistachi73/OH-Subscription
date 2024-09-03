import { and, eq, sql } from "drizzle-orm";

import type { DB } from "@/server/db";
import { like, video } from "@/server/db/schema";

export const isVideoLikedByUserSubquery = ({
  db,
  userId,
}: { db: DB; userId?: string }) => {
  if (!userId) return sql<boolean>`false`.as("isLikedByUser");

  return sql<boolean>`exists(${db
    .select({ n: sql`1` })
    .from(like)
    .where(
      and(eq(like.videoId, video.id), eq(like.userId, userId ?? "")),
    )})`.as("isLikedByUser");
};
