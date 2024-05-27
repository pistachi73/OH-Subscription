"use client";

import "@github/relative-time-element";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit,
  EllipsisVertical,
  Heart,
  Loader2,
  Reply,
  Trash,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AddComment } from "./add-comment";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { regularEase } from "@/lib/animation";
import { cn } from "@/lib/utils";
import type { Comment as CommentData } from "@/server/db/schema.types";
import { api } from "@/trpc/react";
import { UserAvatar } from "../user-avatar";
import { SkeletonComment } from "./skeleton-comment";

type CommentProps = {
  userId?: string;
  parentCommentId?: string;
  commendId?: string;
  isReply?: boolean;
  comment?: CommentData;
};

export const Comment = ({ isReply, comment }: CommentProps) => {
  const user = useCurrentUser();
  const apiUtils = api.useUtils();
  const [showAddReply, setShowAddReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [addedReplies, setAddedReplies] = useState<CommentData[]>([]);

  const { mutateAsync: deleteComment, isLoading: isDeletingComment } =
    api.comment.delete.useMutation({
      onSuccess: () => {
        apiUtils.comment.getByProgramId.invalidate();
      },
    });

  const { mutateAsync: addReply } = api.reply.create.useMutation({
    onSuccess: ({ reply }) => {
      setShowAddReply(false);
      if (reply) {
        setAddedReplies((current) => [
          {
            ...reply,
            user: {
              id: user.id as string,
              name: user.name as string,
              image: user.image ?? null,
            },
          },
          ...current,
        ]);
      }
      setShowReplies(true);
    },
  });

  const {
    data,
    isFetching: isFetchingReplies,
    isLoading: isLoadingReplies,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.reply.getByCommentId.useInfiniteQuery(
    {
      //NEEDS TO BE FIXED
      commentId: comment?.id ?? 0,
      pageSize: 2,
    },
    {
      enabled: false,
      getNextPageParam: (lastPage) => {
        console.log({ lastPage });
        return lastPage.nextCursor;
      },
    },
  );

  const onCommentDelete = async () => {
    if (!comment?.id) return;

    await deleteComment({
      commentId: comment.id,
    });
  };

  const onReply = async (content: string) => {
    if (!user.id || !comment?.id) return;

    await addReply({
      userId: user.id,
      commentId: comment.id,
      content,
    });
  };

  const isUserComment = user.id === comment?.user?.id;

  const replies = useMemo(() => {
    return [
      ...addedReplies,
      ...(data?.pages.flatMap((page) => page.replies) ?? []),
    ];
  }, [data, addedReplies]);

  return (
    <>
      <div
        className={cn(
          "transition-opacity",
          isReply && "flex-end flex w-full flex-col items-end ",
          isDeletingComment && "opacity-50 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "relative flex w-full flex-col gap-2  rounded-md border border-input bg-background p-4",
            "sm:gap-3",
            {
              "w-11/12 justify-end sm:w-4/5": isReply,
              "w-full": !isReply,
            },
          )}
        >
          {isUserComment && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-7 w-7"
                >
                  <EllipsisVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-10">
                <DropdownMenuItem>
                  <Edit size={16} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={onCommentDelete}
                >
                  <Trash size={16} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="flex flex-row items-center  gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <UserAvatar
                userImage={comment?.user?.image}
                userName={comment?.user?.name}
                className="h-7 w-7 text-xs"
              />
              <p className="text-xs font-medium sm:text-sm">
                {comment?.user?.name ?? "John Doe"}
              </p>
            </div>

            <span className="text-xs text-gray-400 sm:text-sm font-light">
              <relative-time datetime={comment?.updatedAt?.toString()}>
                April 1, 2014
              </relative-time>
            </span>
          </div>
          <p className="max-w-[70ch] text-xs text-gray-800 sm:text-sm">
            {comment?.id}
            {" - "}
            {comment?.updatedAt?.toISOString()} {" - "}
            {comment?.content ??
              "Just finished watching this video and I loved it! The production quality was top-notch, and the content was super informative. Can&apos;t wait for more videos like this! 😄👍"}
          </p>
          <div className="flex flex-row gap-3">
            <Button
              variant="ghost"
              className="h-6 px-0 py-0 text-xs font-normal text-gray-600 hover:bg-transparent"
            >
              <Heart size={16} className="sm:mr-2" />

              <span className="hidden sm:inline">11 Likes</span>
            </Button>
            {!isReply && (
              <>
                <Button
                  variant="ghost"
                  className="h-6 px-0 py-0 text-xs font-normal text-gray-600 hover:bg-transparent"
                  onClick={() => {
                    setShowAddReply(!showAddReply);
                  }}
                >
                  <Reply size={16} className="sm:mr-2 " />
                  <span className="hidden sm:inline">Reply</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-6 px-0 py-0 text-xs font-normal text-gray-600 hover:bg-transparent"
                  onClick={() => {
                    if (!showReplies && !data?.pages) {
                      fetchNextPage();
                    }
                    setShowReplies(!showReplies);
                  }}
                >
                  {showReplies ? "Hide replies" : "Show replies (2)"}
                </Button>
              </>
            )}
          </div>
        </div>
        <AnimatePresence initial={false}>
          {showAddReply && (
            <motion.div
              variants={{
                animate: {
                  opacity: 1,
                  y: 0,
                  height: "auto",
                  transition: {
                    ease: regularEase,
                    duration: 0.3,
                    opacity: { delay: 0.25, duration: 0.1 },
                    y: { delay: 0.25 },
                  },
                },
                exit: {
                  opacity: 0,
                  height: 0,
                  y: -8,
                  transition: {
                    duration: 0.3,
                    ease: regularEase,
                    height: { delay: 0.25 },
                    opacity: { duration: 0.1 },
                  },
                },
              }}
              initial="exit"
              animate="animate"
              exit="exit"
              className={cn({
                "w-11/12 justify-end sm:w-4/5": isReply,
                "w-full": !isReply,
              })}
            >
              <AddComment
                containerClassName="pt-4"
                autoFocus
                onCancel={() => {
                  setShowAddReply(false);
                }}
                commentLabel="Reply"
                cancelLabel="Cancel"
                placeholder="Add your reply..."
                onComment={onReply}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {showReplies && (
        <>
          {isFetchingReplies && isLoadingReplies && <SkeletonComment isReply />}
          {replies.map((reply) => (
            <Comment key={`reply-${reply.id}`} isReply comment={reply} />
          ))}
          {!isReply && hasNextPage && (
            <div className="flex-end flex w-full flex-col items-end">
              <div className="w-11/12 sm:w-4/5 flex justify-center">
                <Button
                  type="button"
                  variant={"ghost"}
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="text-muted-foreground -mt-2"
                >
                  {isFetchingNextPage && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Load more replies
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
