"use client";

import { Loader2 } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { AddComment } from "@/components/ui/comments/add-comment";
import { COMMENTS_PAGE_SIZE, Comment } from "@/components/ui/comments/comment";

import { FirstToComment } from "@/components/ui/comments/first-to-comment";
import { SkeletonComment } from "@/components/ui/comments/skeleton-comment";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ProgramChapter } from "@/server/db/schema.types";
import { api } from "@/trpc/react";

type ChapterCommunityProps = {
  chapter: NonNullable<ProgramChapter>;
};

export const ChapterCommunity = ({ chapter }: ChapterCommunityProps) => {
  const user = useCurrentUser();
  const apiUtils = api.useUtils();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.comment.getByProgramIdOrVideoId.useInfiniteQuery(
      {
        videoId: chapter.id,
        pageSize: COMMENTS_PAGE_SIZE,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { mutateAsync: addComment } = api.comment.create.useMutation({
    onSuccess: () => {
      apiUtils.comment.getByProgramIdOrVideoId.invalidate({
        videoId: chapter.id,
        pageSize: COMMENTS_PAGE_SIZE,
      });
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
    <div className="my-8 w-full sm:mt-12">
      <div className="mb-4 flex flex-row items-center justify-between">
        <h2 className="text-lg font-medium sm:text-xl">Discussion (20)</h2>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 px-4"
            >
              {sort}
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5} align="end" className="w-44">
            <DropdownMenuItem
              onSelect={() => {
                setSort("Newest");
              }}
            >
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setSort("Oldest");
              }}
            >
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setSort("Most liked");
              }}
            >
              Most liked
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="w-full max-w-[750px] space-y-2 sm:space-y-4">
        <div className="flex flex-row gap-3">
          <UserAvatar userImage={user.image} userName={user.name} />
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
