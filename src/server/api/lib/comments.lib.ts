import type { DB } from "@/server/db";
import { comments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const deleteRecursiveComments = async ({
  db,
  commentId,
}: {
  db: DB;
  commentId: number;
}) => {
  await db.delete(comments).where(eq(comments.id, commentId));

  const childComments = await db
    .select({
      id: comments.id,
    })
    .from(comments)
    .where(eq(comments.parentCommentId, commentId));

  for (const childComment of childComments) {
    await deleteRecursiveComments({
      db,
      commentId: childComment.id,
    });
  }

  return true;
};
