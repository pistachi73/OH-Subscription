import type { DB } from "@/server/db";
import { comments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const deleteRecursiveComments = async ({
  db,
  commentId,
  deletedComments,
}: {
  db: DB;
  commentId: number;
  deletedComments: number;
}) => {
  await db.delete(comments).where(eq(comments.id, commentId));

  const childComments = await db
    .select({
      id: comments.id,
    })
    .from(comments)
    .where(eq(comments.parentCommentId, commentId));

  deletedComments += childComments?.length ?? 0;

  for (const childComment of childComments) {
    await deleteRecursiveComments({
      db,
      commentId: childComment.id,
      deletedComments,
    });
  }

  return deletedComments;
};

export const getRecursiveCommentsCount = async ({
  db,
  commentId,
  totalComments,
}: {
  db: DB;
  commentId: number;
  totalComments: number;
}) => {
  const childComments = await db
    .select({
      id: comments.id,
    })
    .from(comments)
    .where(eq(comments.parentCommentId, commentId))
    .groupBy(comments.id);

  totalComments += childComments?.length ?? 0;

  for (const childComment of childComments) {
    await getRecursiveCommentsCount({
      db,
      commentId: childComment.id,
      totalComments,
    });
  }

  return totalComments;
};
