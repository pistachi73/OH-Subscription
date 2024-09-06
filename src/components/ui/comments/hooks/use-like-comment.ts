import { api } from "@/trpc/react";
import { COMMENTS_PAGE_SIZE } from "../comment";
import type { ExclusiveCommentSource } from "../comment.types";
export type UseLikeCommentProps = ExclusiveCommentSource & {
  commentId: number;
};

export const useLikeComment = ({ commentId, ...rest }: UseLikeCommentProps) => {
  const apiUtils = api.useUtils();

  const handleLikeCommentUpdate = () => {
    apiUtils.comment.getCommentsBySourceId.setInfiniteData(
      {
        pageSize: COMMENTS_PAGE_SIZE,
        ...rest,
      },
      (data) => {
        if (!data) return data;
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            comments: page.comments.map((filteredComment) => {
              if (filteredComment.id === commentId) {
                return {
                  ...filteredComment,
                  likes:
                    filteredComment.likes +
                    (!filteredComment?.isLikeByUser ? 1 : -1),
                  isLikeByUser: !filteredComment.isLikeByUser,
                };
              }
              return filteredComment;
            }),
          })),
        };
      },
    );
  };

  const { mutateAsync: likeComment, isLoading: isLikeLoading } =
    api.like.like.useMutation({
      onMutate: () => {
        handleLikeCommentUpdate();
      },
      onError: () => {
        handleLikeCommentUpdate();
      },
    });

  const { mutateAsync: unlikeComment, isLoading: isUnlikeLoading } =
    api.like.unlikeBySourceId.useMutation({
      onSuccess: () => {
        apiUtils.comment.getCommentsBySourceId.setInfiniteData(
          {
            pageSize: COMMENTS_PAGE_SIZE,
            ...rest,
          },
          (data) => {
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                comments: page.comments.map((filteredComment) => {
                  if (filteredComment.id === commentId) {
                    return {
                      ...filteredComment,
                      likes: filteredComment.likes - 1,
                      isLikeByUser: false,
                    };
                  }
                  return filteredComment;
                }),
              })),
            };
          },
        );
      },
    });

  return {
    likeComment,
    unlikeComment,
    isLikeLoading: isLikeLoading || isUnlikeLoading,
  };
};
