import { Loader2, SendHorizonal } from "lucide-react";

import { ShotSideWrapper } from "./shot-side-wrapper";

import { Button } from "@/components/ui/button";
import { FirstToComment } from "@/components/ui/comments/first-to-comment";
import { MustBeLoggedIn } from "@/components/ui/comments/must-be-logged-in";
import { SkeletonComment } from "@/components/ui/comments/skeleton-comment";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useMemo, useState } from "react";
import type { ShotProps } from ".";
import { AddComment } from "../../ui/comments/add-comment";
import { COMMENTS_PAGE_SIZE, Comment } from "../../ui/comments/comment";
import { useDeviceType } from "../../ui/device-only/device-only-provider";
import { useShotContext } from "./shot-context";

export const ShotCommunity = ({ shot }: ShotProps) => {
  const user = useCurrentUser();
  const { showComments, setShowComments } = useShotContext();
  const { isMobile } = useDeviceType();

  const [sort, setSort] = useState("Sort");

  return (
    <ShotSideWrapper
      isDialogOpen={showComments}
      onDialogOpenChange={(open) => {
        setShowComments(open);
      }}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col",
          "xl:border xl:bg-background xl:border-l-0",
          "sm:rounded-r-xl",
          "overflow-hidden",
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between px-4 py-3",
            isMobile && "pt-0",
          )}
        >
          <h2 className={cn("text-base font-medium md:text-lg")}>Discussion</h2>
        </div>
        {user ? (
          <ShotCommunityComments shot={shot} />
        ) : (
          <div className="px-4 flex items-center justify-center h-full pb-4 w-full">
            <MustBeLoggedIn />
          </div>
        )}
      </div>
    </ShotSideWrapper>
  );
};

export const ShotCommunityComments = ({ shot }: ShotProps) => {
  const user = useCurrentUser();
  const [commentValue, setCommentValue] = useState("");
  const apiUtils = api.useUtils();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.comment.getByProgramIdOrVideoId.useInfiniteQuery(
      {
        shotId: shot.id,
        pageSize: COMMENTS_PAGE_SIZE,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnMount: false,
      },
    );

  const { mutateAsync: addComment } = api.comment.create.useMutation({
    onSuccess: ({ comment }) => {
      const newComment = comment
        ? {
            ...comment,
            totalReplies: 0,
            user: {
              id: user.id as string,
              name: user.name as string,
              image: user.image ?? null,
            },
          }
        : null;

      apiUtils.comment.getByProgramIdOrVideoId.setInfiniteData(
        {
          shotId: shot.id,
          pageSize: COMMENTS_PAGE_SIZE,
        },
        (data) => {
          if (!newComment) return data;
          return {
            pages: [
              {
                comments: [newComment],
                nextCursor: newComment.updatedAt,
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
      shotId: shot.id,
      content: commentValue,
    });

    setCommentValue("");
  };

  const comments = useMemo(() => {
    return data?.pages.flatMap((page) => page.comments);
  }, [data]);

  console.log({ comments });

  return (
    <div className="flex flex-col justify-end h-full overflow-hidden overflow-y-auto">
      <div className="flex flex-col items-start gap-5 overflow-y-auto p-4">
        {isLoading ? (
          <SkeletonComment className="p-0 border-transparent" />
        ) : !comments?.length ? (
          <FirstToComment className="p-0 border-transparent" />
        ) : (
          comments?.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              shotId={shot.id}
              className="p-0 border-transparent"
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
