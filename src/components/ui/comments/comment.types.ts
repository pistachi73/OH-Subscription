import type { Comment } from "@/server/db/schema.types";

type XOR<T, U> = T | U extends object
  ? T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : T
    : U
  : T | U;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type ExclusiveCommentSource = XOR<
  { programId: number },
  XOR<{ videoId: number }, XOR<{ shotId: number }, { parentCommentId: number }>>
>;

export type CommentProps = ExclusiveCommentSource & {
  comment: Comment;
  level?: number;
  className?: string;
  optionsButtonClassname?: string;
};
