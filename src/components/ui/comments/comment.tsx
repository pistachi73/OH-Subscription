"use client";

import "@github/relative-time-element";
import { motion } from "framer-motion";
import {
  Edit,
  EllipsisVertical,
  Heart,
  Loader2,
  MessageCircleOff,
  ReplyIcon,
  SendHorizonal,
  Trash,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AddComment } from "./add-comment";

import type { AutosizeTextAreaRef } from "@/components/ui/autosize-textarea";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { regularEase } from "@/lib/animation";
import { cn } from "@/lib/utils";
import type { Comment as CommentData } from "@/server/db/schema.types";
import { api } from "@/trpc/react";
import { Reply } from "./reply";
import { SkeletonComment } from "./skeleton-comment";

export const COMMENTS_PAGE_SIZE = 2;

type CommentProps = {
  comment?: CommentData;
  programId?: number;
  videoId?: number;
};

export const Comment = ({ comment, programId, videoId }: CommentProps) => {
  const user = useCurrentUser();
  const apiUtils = api.useUtils();
  const [showAddReply, setShowAddReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editInputValue, setEditInputValue] = useState(comment?.content ?? "");
  const inputRef = useRef<AutosizeTextAreaRef>(null);
  const {
    data: repliesData,
    isInitialLoading: isInitialLoadingReplies,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.reply.getByCommentId.useInfiniteQuery(
    {
      //NEEDS TO BE FIXED
      commentId: comment?.id ?? 0,
      pageSize: COMMENTS_PAGE_SIZE,
    },
    {
      enabled: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { mutateAsync: deleteComment, isLoading: isDeletingComment } =
    api.comment.delete.useMutation({
      onSuccess: () => {
        if (!programId && !videoId) return;

        apiUtils.comment.getByProgramIdOrVideoId.invalidate({
          ...(programId && { programId }),
          ...(videoId && { videoId }),
          pageSize: COMMENTS_PAGE_SIZE,
        });
      },
    });

  const { mutateAsync: editComment, isLoading: isEditingComment } =
    api.comment.update.useMutation({
      onSuccess: async () => {
        await apiUtils.comment.getByProgramIdOrVideoId.invalidate({
          ...(programId && { programId }),
          ...(videoId && { videoId }),
          pageSize: COMMENTS_PAGE_SIZE,
        });
        setIsEditing(false);
      },
    });

  const { mutateAsync: addReply } = api.reply.create.useMutation({
    onSuccess: ({ reply }) => {
      setShowAddReply(false);
      setShowReplies(true);

      const newReply = reply
        ? {
            ...reply,
            user: {
              id: user.id as string,
              name: user.name as string,
              image: user.image ?? null,
            },
          }
        : null;

      apiUtils.reply.getByCommentId.setInfiniteData(
        { commentId: comment?.id ?? 0, pageSize: COMMENTS_PAGE_SIZE },
        (data) => {
          if (!newReply) return data;
          return {
            pages: [
              {
                replies: [newReply],
                nextCursor: Number(comment?.totalReplies)
                  ? newReply.updatedAt
                  : null,
              },
              ...(data?.pages ?? []),
            ],
            pageParams: data?.pageParams ?? [],
          };
        },
      );

      apiUtils.comment.getByProgramIdOrVideoId.invalidate({
        pageSize: COMMENTS_PAGE_SIZE,
        ...(programId && { programId }),
        ...(videoId && { videoId }),
      });
    },
  });

  const onCommentDelete = async () => {
    if (!comment?.id) return;

    await deleteComment({
      commentId: comment.id,
    });
  };

  const onCommentEdit = async () => {
    if (!comment?.id || !user.id) return;

    await editComment({
      id: comment.id,
      userId: user.id,
      content: editInputValue,
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

  const isUserComment = useMemo(
    () => user.id === comment?.user?.id,
    [comment, user],
  );

  const replies = useMemo(
    () => repliesData?.pages.flatMap((page) => page.replies),
    [repliesData],
  );

  return (
    <>
      <div
        className={cn(
          "relative flex w-full transition-all flex-col gap-2  rounded-md border border-input bg-background p-4",
          "sm:gap-3",
          isDeletingComment && "opacity-50 pointer-events-none",
          isEditing && "border-primary shadow-md",
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
              <DropdownMenuItem
                onClick={() => {
                  setIsEditing(true);
                  setTimeout(() => inputRef?.current?.textArea.focus(), 200);
                }}
              >
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

        <div className="flex flex-row items-center  gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <UserAvatar
              userImage={comment?.user?.image}
              userName={comment?.user?.name}
              className="h-7 w-7 text-xs"
            />
            <p className="font-medium">{comment?.user?.name ?? "John Doe"}</p>
          </div>

          <span className="text-muted-foreground font-light">
            <relative-time datetime={comment?.updatedAt?.toString()}>
              April 1, 2014
            </relative-time>
          </span>
          {isEditing && (
            <span className="text-muted-foreground font-light">Editing...</span>
          )}
        </div>
        {isEditing ? (
          <AutosizeTextarea
            ref={inputRef}
            minHeight={33}
            className={cn(
              "border-none resize-none font-light bg-accent/30 transition-opacity  focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:ring-transparent",
              isEditingComment && "cursor-wait opacity-50",
            )}
            value={editInputValue}
            onChange={(e) => setEditInputValue(e.target.value)}
            onFocus={(e) =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length,
              )
            }
          />
        ) : (
          <p className="max-w-[70ch] text-xs text-gray-800 sm:text-sm">
            {comment?.content ??
              "Just finished watching this video and I loved it! The production quality was top-notch, and the content was sFuer informative. Can&apos;t wait for more videos like this! 😄👍"}
          </p>
        )}
        <div className="flex flex-row gap-3">
          <Button
            variant="ghost"
            className="h-6 px-0 py-0 text-xs font-normal text-muted-foreground hover:bg-transparent"
          >
            <Heart size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">11 Likes</span>
          </Button>
          <Button
            variant="ghost"
            className="h-6 px-0 py-0 text-xs font-normal text-muted-foreground hover:bg-transparent"
            onClick={() => {
              setShowAddReply(!showAddReply);
            }}
          >
            <ReplyIcon size={16} className="sm:mr-2 " />
            <span className="hidden sm:inline">Reply</span>
          </Button>
          {Number(comment?.totalReplies) ? (
            <Button
              variant="ghost"
              className="h-6 px-0 py-0 text-xs font-normal text-muted-foreground hover:bg-transparent"
              onClick={() => {
                if (!showReplies && !repliesData?.pages) {
                  fetchNextPage();
                }
                setShowReplies(!showReplies);
              }}
            >
              {showReplies
                ? "Hide replies"
                : `Show replies (${comment?.totalReplies})`}
            </Button>
          ) : null}
        </div>

        {isEditing && (
          <div className="absolute bottom-3 right-3 space-x-1 sm:block">
            <Button
              variant="secondary"
              size="sm"
              className="w-9 h-8 px-0 text-sm sm:w-fit sm:px-3"
              type="button"
              disabled={isEditingComment}
              onClick={() => {
                setIsEditing(false);
              }}
            >
              <span className="hidden sm:inline-block">Cancel</span>
              <MessageCircleOff size={14} className="sm:hidden" />
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              className="w-9 sm:h-8 px-0 text-sm sm:w-fit sm:px-3"
              disabled={isEditingComment}
              onClick={onCommentEdit}
            >
              <span className="hidden sm:inline-block">Update</span>
              <SendHorizonal size={14} className="sm:hidden" />
            </Button>
          </div>
        )}
      </div>
      {showAddReply && (
        <motion.div
          animate={{
            opacity: 1,
            y: 0,
            height: "auto",
            transition: {
              ease: regularEase,
              duration: 0.3,
              opacity: { delay: 0.25, duration: 0.1 },
              y: { delay: 0.25 },
            },
          }}
          initial={{ opacity: 0, y: -8, height: 0 }}
          className="w-full"
        >
          <AddComment
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
      {showReplies && (
        <>
          {isInitialLoadingReplies && <SkeletonComment isReply />}
          {replies?.map((reply) => (
            <Reply
              key={`reply-${reply.id}`}
              reply={reply}
              parentCommentId={comment?.id ?? 0}
              isDeletingParentComment={isDeletingComment}
              programId={programId}
              videoId={videoId}
            />
          ))}
          {hasNextPage && (
            <div className="flex-end flex w-full flex-col items-end">
              <div className="w-11/12 flex justify-center">
                <Button
                  type="button"
                  variant={"ghost"}
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="-mt-2"
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
