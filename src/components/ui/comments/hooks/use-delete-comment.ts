import { api } from "@/trpc/client";
import { COMMENTS_PAGE_SIZE } from "../comment";
import type { ExclusiveCommentSource } from "../comment.types";

type UseDeleteCommentProps = ExclusiveCommentSource & {
  id: number;
};

export const useDeleteComment = ({
  id,
  ...commentSource
}: UseDeleteCommentProps) => {
  const apiUtils = api.useUtils();
  const { mutateAsync: deleteComment, isPending: isDeletingComment } =
    api.comment.delete.useMutation({
      onSuccess: ({ numberOfDeletedComments }) => {
        apiUtils.comment.getTotalCommentsBySourceId.setData(
          {
            ...commentSource,
          },
          (data) => {
            if (!data) return data;
            return data - numberOfDeletedComments;
          },
        );

        apiUtils.comment.getCommentsBySourceId.setInfiniteData(
          {
            pageSize: COMMENTS_PAGE_SIZE,
            ...commentSource,
          },
          (data) => {
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                comments: page.comments.filter(
                  (filteredComment) => filteredComment.id !== id,
                ),
              })),
            };
          },
        );
      },
    });

  return {
    deleteComment,
    isDeletingComment,
  };
};
