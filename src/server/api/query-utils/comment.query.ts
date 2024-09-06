import type { DB } from "@/server/db";
import { comment, like, user } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const commentSelect = {
  id: comment.id,
  content: comment.content,
  updatedAt: comment.updatedAt,
  parentCommentId: comment.parentCommentId,
  likes: comment.likes,
};

export const commentUserSelect = {
  id: user.id,
  name: user.name,
  image: user.image,
};

export const commentRepliesAlias = alias(comment, "replies");
export const commentTotalRepliesSelect = sql<number>`count(${commentRepliesAlias.id})`;

export const isCommentLikedByUserSubquery = ({
  db,
  userId,
}: { db: DB; userId?: string }) => {
  if (!userId) return sql<boolean>`false`.as("isLikedByUser");
  return sql<boolean>`exists(${db
    .select({ n: sql`1` })
    .from(like)
    .where(
      and(eq(like.commentId, comment.id), eq(like.userId, userId ?? "")),
    )})`.as("isLikedByUser");
};
