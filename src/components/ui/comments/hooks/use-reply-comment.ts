import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/trpc/react";
import { useState } from "react";
import { COMMENTS_PAGE_SIZE } from "../comment";
import type { ExclusiveCommentSource } from "../comment.types";

type UseReplyCommentProps = ExclusiveCommentSource & {
  commentId: number;
  totalReplies: number;
};

export const useReplyComment = ({
  commentId,
  totalReplies,
  ...commentSource
}: UseReplyCommentProps) => {
  const user = useCurrentUser();
  const [showAddReply, setShowAddReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const apiUtils = api.useUtils();

  const { mutateAsync: addReply } = api.comment.create.useMutation({
    onSuccess: ({ comment: newComment }) => {
      setShowAddReply(false);
      setShowReplies(true);

      const reply = newComment
        ? {
            ...newComment,
            parentCommentId: commentId,
            totalReplies: 0,
            user: {
              id: user.id as string,
              name: user.name as string,
              image: user.image ?? null,
            },
            isLikeByUser: false,
          }
        : null;

      apiUtils.comment.getTotalCommentsBySourceId.setData(
        {
          ...commentSource,
        },
        (data) => {
          if (!data) return;
          return data + 1;
        },
      );

      apiUtils.comment.getBySourceId.setInfiniteData(
        { parentCommentId: commentId, pageSize: COMMENTS_PAGE_SIZE },
        (data) => {
          if (!reply) return data;
          return {
            pages: [
              {
                comments: [reply],
                nextCursor: Number(totalReplies) ? reply.updatedAt : null,
              },
              ...(data?.pages ?? []),
            ],
            pageParams: data?.pageParams ?? [],
          };
        },
      );

      apiUtils.comment.getBySourceId.setInfiniteData(
        {
          pageSize: COMMENTS_PAGE_SIZE,
          ...commentSource,
        },
        (data) => {
          if (!data) return data;

          return {
            pages: data.pages.map((page) => ({
              ...page,
              comments: page.comments.map((c) => {
                if (commentId === c.id) {
                  return {
                    ...c,
                    totalReplies: (Number(c.totalReplies) ?? 0) + 1,
                  };
                }
                return c;
              }),
            })),
            pageParams: data?.pageParams ?? [],
          };
        },
      );
    },
  });
  return {
    addReply,
    showAddReply,
    showReplies,
    setShowAddReply,
    setShowReplies,
  };
};
