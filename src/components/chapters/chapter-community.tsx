"use client";

import { Loader2 } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { AddComment } from "@/components/ui/comments/add-comment";
import { COMMENTS_PAGE_SIZE } from "@/components/ui/comments/comment";

import { FirstToComment } from "@/components/ui/comments/first-to-comment";
import { SkeletonComment } from "@/components/ui/comments/skeleton-comment";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ProgramChapter } from "@/server/db/schema.types";
import { api } from "@/trpc/react";
import { Comment } from "../ui/comments/comment";

type ChapterCommunityProps = {
  chapter: NonNullable<ProgramChapter>;
};

export const ChapterCommunity = ({ chapter }: ChapterCommunityProps) => {
  const user = useCurrentUser();
  const apiUtils = api.useUtils();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.comment.getBySourceId.useInfiniteQuery(
      {
        videoId: chapter.id,
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
            videoId: chapter.id,
            parentCommentId: null,
            totalReplies: 0,
            user: {
              id: user.id as string,
              name: user.name as string,
              image: user.image ?? null,
            },
          }
        : null;

      apiUtils.comment.getBySourceId.setInfiniteData(
        {
          videoId: chapter.id,
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
    if (!user.id) return;

    await addComment({
      userId: user.id,
      videoId: chapter.id,
      content,
    });
  };

  const comments = useMemo(() => {
    return data?.pages.flatMap((page) => page.comments);
  }, [data]);

  return (
    <div className="w-full sm:mt-8">
      <div className="mb-4 flex flex-row items-center justify-between">
        <h2 className="text-lg font-medium sm:text-xl">Discussion (20)</h2>
      </div>
      <div className="w-full max-w-[750px] space-y-2 sm:space-y-4">
        <div className="flex flex-row gap-3">
          <UserAvatar userImage={user?.image} userName={user?.name} />
          <AddComment
            placeholder="Add your comment..."
            containerClassName="w-full"
            commentLabel="Comment"
            onComment={onComment}
          />
        </div>

        {isLoading ? (
          <SkeletonComment />
        ) : !comments?.length ? (
          <FirstToComment />
        ) : (
          comments?.map((comment) => (
            <Comment key={comment.id} comment={comment} videoId={chapter.id} />
          ))
        )}

        {hasNextPage && (
          <div className="flex justify-center w-full mt-4">
            <Button
              type="button"
              variant={"ghost"}
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
