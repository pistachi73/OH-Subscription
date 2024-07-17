import { useMemo } from "react";

import { COMMENTS_PAGE_SIZE } from "@/components/ui/comments/comment";

import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/trpc/react";
import type { ExclusiveCommentSource } from "../comment.types";

export const useComments = (commentSource: ExclusiveCommentSource) => {
  const user = useCurrentUser();
  const apiUtils = api.useUtils();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.comment.getBySourceId.useInfiniteQuery(
      {
        ...commentSource,
        pageSize: COMMENTS_PAGE_SIZE,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { mutateAsync: addComment } = api.comment.create.useMutation({
    onSuccess: ({ comment: newComment }) => {
      const reply = newComment
        ? {
            ...newComment,
            ...commentSource,
            parentCommentId: null,
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
          if (!data) return data;
          return data + 1;
        },
      );

      apiUtils.comment.getBySourceId.setInfiniteData(
        {
          ...commentSource,
          pageSize: COMMENTS_PAGE_SIZE,
        },
        (data) => {
          if (!reply) return data;
          return {
            pages: [
              {
                comments: [reply],
                nextCursor: reply.updatedAt,
              },
              ...(data?.pages ?? []),
            ],
            pageParams: data?.pageParams ?? [],
          };
        },
      );
    },
  });

  const onComment = async (content: string) => {
    console.log({ content });
    if (!user.id) return;

    await addComment({
      ...commentSource,
      content,
    });
  };

  const comments = useMemo(() => {
    return data?.pages.flatMap((page) => page.comments);
  }, [data]);

  return {
    onComment,
    comments,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };
};
