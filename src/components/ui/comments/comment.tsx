"use client";

import "@github/relative-time-element";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { AddComment } from "./add-comment";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DeleteOutlineIcon,
  EditCommentOutlineIcon,
  HeartIcon,
  HeartOutlineIcon,
  ReplyOutlineIcon,
  VerticalDotsOutlineIcon,
} from "@/components/ui/icons";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { regularEase } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { m } from "framer-motion";
import type { CommentProps, ExclusiveCommentSource } from "./comment.types";
import { useDeleteComment } from "./hooks/use-delete-comment";
import { useEditComment } from "./hooks/use-edit-comment";
import { useLikeComment } from "./hooks/use-like-comment";
import { useReplyComment } from "./hooks/use-reply-comment";
import { SkeletonComment } from "./skeleton-comment";

export const COMMENTS_PAGE_SIZE = 5;

export const Comment = ({
  comment,
  programId,
  videoId,
  shotId,
  parentCommentId,
  className,
  level = 0,
  optionsButtonClassname,
}: CommentProps) => {
  const user = useCurrentUser();

  const commentSource = useMemo(
    () => ({
      ...(programId && { programId }),
      ...(videoId && { videoId }),
      ...(shotId && { shotId }),
      ...(parentCommentId && { parentCommentId }),
    }),
    [programId, videoId, shotId, parentCommentId],
  );

  const {
    addReply,
    showAddReply,
    showReplies,
    setShowAddReply,
    setShowReplies,
  } = useReplyComment({
    commentId: comment.id,
    totalReplies: comment.totalReplies,
    ...(commentSource as ExclusiveCommentSource),
  });

  const {
    editComment,
    isEditingComment,
    isEditing,
    setIsEditing,
    input,
    setInput,
    inputRef,
  } = useEditComment({
    commentId: comment.id,
    initialCommentContent: comment.content,
    ...(commentSource as ExclusiveCommentSource),
  });

  const { likeComment, isLikeLoading } = useLikeComment({
    commentId: comment.id,
    ...(commentSource as ExclusiveCommentSource),
  });

  const { deleteComment, isDeletingComment } = useDeleteComment({
    commentId: comment.id,
    ...(commentSource as ExclusiveCommentSource),
  });

  const {
    data: repliesData,
    isInitialLoading: isInitialLoadingReplies,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.comment.getBySourceId.useInfiniteQuery(
    {
      parentCommentId: comment.id,
      pageSize: COMMENTS_PAGE_SIZE,
    },
    {
      enabled: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnMount: false,
    },
  );

  const onCommentDelete = async () => {
    if (!comment?.id) return;

    await deleteComment({
      commentId: comment.id,
    });
  };

  const onCommentEdit = async () => {
    if (!comment?.id) return;

    await editComment({
      id: comment.id,
      content: input,
    });
  };

  const onCommentLike = () => {};

  const onReply = async (content: string) => {
    if (!comment?.id || !content) return;

    await addReply({
      parentCommentId: comment.id,
      content,
    });
  };

  const isUserComment = useMemo(
    () => user?.id === comment?.user?.id,
    [comment, user],
  );

  const replies = useMemo(
    () => repliesData?.pages.flatMap((page) => page.comments),
    [repliesData],
  );

  return (
    <>
      <div
        className={cn(
          "relative flex w-full flex-col gap-2",
          "w-[var(--mobile-comment-width)] sm:w-[var(--desktop-comment-width)]",
          isDeletingComment && "opacity-50 pointer-events-none",
          className,
        )}
        style={{
          "--mobile-comment-width": `calc(100% - ${level * 44}px)`,
          "--desktop-comment-width": `calc(100% - ${level * 52}px)`,
        }}
      >
        {isUserComment && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant={"ghost"}
                className={cn(
                  "absolute right-0 top-0 h-7 w-7 hover:bg-transparent text-foreground/70 hover:text-foreground ",
                  optionsButtonClassname,
                )}
              >
                <VerticalDotsOutlineIcon className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-10 z-50"
              withPortal={false}
            >
              <DropdownMenuItem
                onClick={() => {
                  setIsEditing(true);
                  setTimeout(() => inputRef?.current?.textArea.focus(), 200);
                }}
              >
                <EditCommentOutlineIcon className="mr-2 w-4  " />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={onCommentDelete}
              >
                <DeleteOutlineIcon className="mr-2 w-4 " />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="flex flex-row text-sm gap-3">
          <UserAvatar
            userImage={comment?.user?.image}
            userName={comment?.user?.name}
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2">
              <p className="font-medium">{comment?.user?.name ?? "John Doe"}</p>
              <span className="text-muted-foreground font-light">
                <relative-time datetime={comment?.updatedAt?.toString()}>
                  April 1, 2014
                </relative-time>
              </span>
            </div>
            {isEditing ? (
              <div className="p-2">
                <AutosizeTextarea
                  ref={inputRef}
                  minHeight={33}
                  className={cn(
                    "p-0 w-full mb-2 border-none resize-none bg-transparent transition-opacity  focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:ring-transparent",
                    isEditingComment && "cursor-wait opacity-50 ",
                  )}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={(e) =>
                    e.currentTarget.setSelectionRange(
                      e.currentTarget.value.length,
                      e.currentTarget.value.length,
                    )
                  }
                />
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="h-7 sm:h-8 px-2 text-sm w-fit sm:px-3"
                    disabled={isEditingComment}
                    onClick={onCommentEdit}
                  >
                    <span className="">Save changes</span>
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    className="h-7 sm:h-8 px-2 text-sm w-fit sm:px-3"
                    type="button"
                    disabled={isEditingComment}
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    <span>Cancel</span>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="max-w-[70ch] text-foreground text-sm sm:leading-relaxed">
                  {comment?.content ??
                    "Just finished watching this video and I loved it! The production quality was top-notch, and the content was sFuer informative. Can&apos;t wait for more videos like this! 😄👍"}
                </p>
                <div className="flex flex-row gap-3">
                  <Button
                    variant="ghost"
                    className="h-6 px-0 py-0 text-xs font-normal text-muted-foreground hover:bg-transparent disabled:opacity-100"
                    onClick={() =>
                      likeComment({
                        commentId: comment.id,
                      })
                    }
                    disabled={isLikeLoading}
                  >
                    {comment.isLikeByUser ? (
                      <HeartIcon className="mr-1 w-4 h-4 text-red-500" />
                    ) : (
                      <HeartOutlineIcon className="mr-1 w-4 h-4" />
                    )}
                    <span className="mr-1">({comment.likes})</span>
                    <span className="hidden sm:inline">
                      {comment.isLikeByUser ? "Unlike" : "Like"}
                    </span>
                  </Button>
                  {level === 0 && (
                    <Button
                      variant="ghost"
                      className="h-6 px-0 py-0 text-xs font-normal text-muted-foreground hover:bg-transparent"
                      onClick={() => {
                        setShowAddReply(!showAddReply);
                      }}
                    >
                      <ReplyOutlineIcon className="sm:mr-2 w-4 h-4" />
                      <span className="hidden sm:inline">Reply</span>
                    </Button>
                  )}

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
              </>
            )}
          </div>
        </div>
      </div>

      {showReplies && (
        <>
          {isInitialLoadingReplies && (
            <SkeletonComment isReply className={className} level={level + 1} />
          )}
          {replies?.map((reply) => (
            <Comment
              key={`reply-${reply.id}`}
              comment={reply}
              parentCommentId={comment.id}
              className={className}
              optionsButtonClassname={optionsButtonClassname}
              level={level + 1}
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
                    <Loader2 className="mr-2 w-3 animate-spin" />
                  )}
                  Load more replies
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {showAddReply && (
        <m.div
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
          className={cn(
            "w-[var(--mobile-comment-width)] sm:w-[var(--desktop-comment-width)]",
          )}
          style={{
            "--mobile-comment-width": `calc(100% - ${(level + 1) * 44}px)`,
            "--desktop-comment-width": `calc(100% - ${(level + 1) * 52}px)`,
          }}
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
        </m.div>
      )}
    </>
  );
};
