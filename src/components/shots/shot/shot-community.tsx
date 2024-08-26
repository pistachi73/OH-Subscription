import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AddComment } from "@/components/ui/comments/add-comment";
import { Comment } from "@/components/ui/comments/comment";
import { FirstToComment } from "@/components/ui/comments/first-to-comment";
import { useComments } from "@/components/ui/comments/hooks/use-comments";
import { useCommentsCount } from "@/components/ui/comments/hooks/use-comments-count";
import { MustBeSubscribed } from "@/components/ui/comments/must-be-subscribed";
import { SkeletonComment } from "@/components/ui/comments/skeleton-comment";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useIsSubscribed } from "@/hooks/use-is-subscribed";
import { cn } from "@/lib/utils/cn";

import type { ShotProps } from ".";
import { useShotContext } from "./shot-context";
import { ShotSideWrapper } from "./shot-side-wrapper";

export const ShotCommunity = ({ shot }: ShotProps) => {
  const isSubscribed = useIsSubscribed();
  const { showComments, setShowComments } = useShotContext();
  const { commentsCount, isLoading } = useCommentsCount({
    shotId: shot.id,
  });
  const { isMobile } = useDeviceType();
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
          <h2 className={cn("text-base font-medium md:text-lg")}>
            Discussion {!isLoading && `(${commentsCount})`}
          </h2>
        </div>
        {isSubscribed ? (
          <ShotCommunityComments shot={shot} />
        ) : (
          <div className="px-4 flex items-center justify-center h-full pb-4 w-full">
            <MustBeSubscribed />
          </div>
        )}
      </div>
    </ShotSideWrapper>
  );
};

export const ShotCommunityComments = ({ shot }: ShotProps) => {
  const user = useCurrentUser();
  const [commentValue, setCommentValue] = useState("");

  const {
    onComment,
    comments,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useComments({
    shotId: shot.id,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden overflow-y-auto justify-between">
      <div className="flex flex-col gap-5 overflow-y-auto p-4 items-end no-scrollbar">
        {isLoading ? (
          <SkeletonComment className="p-0 border-transparent bg-transparent" />
        ) : !comments?.length ? (
          <FirstToComment className="p-0 border-transparent" />
        ) : (
          comments?.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              shotId={shot.id}
              optionsButtonClassname="top-0 right-0"
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
              onClick={async () => {
                await onComment(commentValue);
                setCommentValue("");
              }}
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
