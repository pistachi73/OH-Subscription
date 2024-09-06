import type { DB } from "@/server/db";
import { comment } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const deleteRecursiveComments = async ({
  db,
  commentId,
  numberOfDeletedComments,
}: {
  db: DB;
  commentId: number;
  numberOfDeletedComments: number;
}) => {
  await db.delete(comment).where(eq(comment.id, commentId));

  const childComments = await db
    .select({
      id: comment.id,
    })
    .from(comment)
    .where(eq(comment.parentCommentId, commentId));

  numberOfDeletedComments += childComments?.length ?? 0;

  for (const childComment of childComments) {
    await deleteRecursiveComments({
      db,
      commentId: childComment.id,
      numberOfDeletedComments,
    });
  }

  return numberOfDeletedComments;
};
