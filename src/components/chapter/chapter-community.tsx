"use client";

import { useMemo, useState } from "react";

import { COMMENTS_PAGE_SIZE, Comment } from "@/components/ui/comments/comment";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Filter, Loader2, SendHorizonal, X } from "lucide-react";
import { Button } from "../ui/button";
import { AddComment } from "../ui/comments/add-comment";
import { FirstToComment } from "../ui/comments/first-to-comment";
import { MustBeLoggedIn } from "../ui/comments/must-be-logged-in";
import { SkeletonComment } from "../ui/comments/skeleton-comment";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import { UserAvatar } from "../ui/user-avatar";
import type { ChapterProps } from "./chapter";
import { useChapterContext } from "./chapter-context";
import { ChapterSideWrapper } from "./chapter-side-wrapper";

export const ChapterCommunity = ({
  chapter,
}: Omit<ChapterProps, "program">) => {
  const user = useCurrentUser();
  const { activeTab, setActiveTab } = useChapterContext();
  const { isMobile } = useDeviceType();

  return (
    <ChapterSideWrapper
      isDialogOpen={activeTab === "comments"}
      onDialogOpenChange={(open) => {
        if (!open) {
          setActiveTab(null);
        }
      }}
    >
      <div className={cn("flex h-full w-full flex-col", "overflow-hidden")}>
        <div
          className={cn(
            "flex flex-row items-center justify-between p-4  pb-0",
            isMobile && "pt-0",
          )}
        >
          <h2 className={cn("text-base font-medium md:text-lg")}>Discussion</h2>
          <div className="flex items-center">
            <Button variant="ghost" className="p-2">
              <Filter size={20} />
            </Button>
            <Button
              variant="ghost"
              className="p-2 hidden md:block"
              onClick={() => setActiveTab(null)}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        {user ? (
          <ChapterCommunityComments chapter={chapter} />
        ) : (
          <div className="px-4 flex items-center justify-center h-full pb-4 w-full">
            <MustBeLoggedIn />
          </div>
        )}
      </div>
    </ChapterSideWrapper>
  );
};
const ChapterCommunityComments = ({
  chapter,
}: Omit<ChapterProps, "program">) => {
  const user = useCurrentUser();
  const apiUtils = api.useUtils();
  const [commentValue, setCommentValue] = useState("");

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

  const onComment = async () => {
    if (!user.id) return;

    await addComment({
      userId: user.id,
      videoId: chapter.id,
      content: commentValue,
    });

    setCommentValue("");
  };

  const comments = useMemo(() => {
    return data?.pages.flatMap((page) => page.comments);
  }, [data]);

  return (
    <div className="flex flex-col h-full overflow-hidden overflow-y-auto justify-between">
      <div className="flex flex-col gap-5 overflow-y-auto p-4 items-end no-scrollbar">
        {isLoading ? (
          <SkeletonComment className="p-0 border-transparent" />
        ) : !comments?.length ? (
          <FirstToComment className="p-0 border-transparent" />
        ) : (
          comments?.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              videoId={chapter.id}
              className="p-0 border-transparent bg-muted-background"
              optionsButtonClassname="top-0 right-0"
            />
          ))
        )}

        {hasNextPage && (
          <div className="flex justify-center w-full">
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
      <div className="border-t p-4">
        <div className="flex flex-row gap-3">
          <UserAvatar
            className="h-8 w-8"
            userImage={user?.image}
            userName={user?.name}
          />
          <AddComment
            containerClassName="w-full"
            className="p-2"
            controlledValue={commentValue}
            setControlledValue={setCommentValue}
          />
          <div className="flex items-end">
            <Button
              variant={"ghost"}
              type="button"
              size={"icon"}
              onClick={onComment}
              className="flex items-center justify-center h-8 w-8"
            >
              <SendHorizonal size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
