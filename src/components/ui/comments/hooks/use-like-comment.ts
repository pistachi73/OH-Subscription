import { api } from "@/trpc/client";
import { COMMENTS_PAGE_SIZE } from "../comment";
import type { ExclusiveCommentSource } from "../comment.types";
export type UseLikeCommentProps = ExclusiveCommentSource & {
  id: number;
};

export const useLikeComment = ({ id, ...rest }: UseLikeCommentProps) => {
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
              if (filteredComment.id === id) {
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

  const { mutateAsync: likeComment, isPending: isLikeLoading } =
    api.like.likeBySourceId.useMutation({
      onMutate: () => {
        handleLikeCommentUpdate();
      },
      onError: () => {
        handleLikeCommentUpdate();
      },
    });

  return {
    likeComment,
    isLikeLoading: isLikeLoading,
  };
};
