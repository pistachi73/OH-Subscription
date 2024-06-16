import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import type { Reply as ReplyData } from "@/server/db/schema.types";
import { api } from "@/trpc/react";
import {
  Edit,
  EllipsisVertical,
  Heart,
  MessageCircleOff,
  SendHorizonal,
  Trash,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { AutosizeTextAreaRef } from "../autosize-textarea";
import { AutosizeTextarea } from "../autosize-textarea";
import { UserAvatar } from "../user-avatar";
import { COMMENTS_PAGE_SIZE } from "./comment";

type ReplyProps = {
  reply: ReplyData;
  parentCommentId: number;
  isDeletingParentComment: boolean;
  programId?: number;
  videoId?: number;
  shotId?: number;
  className?: string;
};

export const Reply = ({
  reply,
  parentCommentId,
  isDeletingParentComment,
  programId,
  videoId,
  shotId,
  className,
}: ReplyProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editInputValue, setEditInputValue] = useState(reply?.content ?? "");
  const textAreaRef = useRef<AutosizeTextAreaRef>(null);

  const user = useCurrentUser();
  const apiUtils = api.useUtils();

  const { mutateAsync: editReply, isLoading: isEditingReply } =
    api.reply.update.useMutation({
      onSuccess: async () => {
        apiUtils.reply.getByCommentId.setInfiniteData(
          { commentId: parentCommentId, pageSize: COMMENTS_PAGE_SIZE },
          (data) => {
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                replies: page.replies.map((filteredReply) => {
                  if (filteredReply.id === reply?.id) {
                    return {
                      ...filteredReply,
                      content: editInputValue,
                    };
                  }
                  return filteredReply;
                }),
              })),
            };
          },
        );

        setIsEditing(false);
      },
    });

  const { mutateAsync: deleteReply, isLoading: isDeletingReply } =
    api.reply.delete.useMutation({
      onSuccess: () => {
        apiUtils.reply.getByCommentId.setInfiniteData(
          { commentId: parentCommentId, pageSize: COMMENTS_PAGE_SIZE },
          (data) => {
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                replies: page.replies.filter(
                  (filteredReply) => filteredReply.id !== reply?.id,
                ),
              })),
            };
          },
        );

        apiUtils.comment.getBySourceId.setInfiniteData(
          {
            pageSize: COMMENTS_PAGE_SIZE,
            ...(programId && { programId }),
            ...(videoId && { videoId }),
            ...(shotId && { shotId }),
          },
          (data) => {
            if (!data) return data;

            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                comments: page.comments.map((c) => {
                  if (c.id === parentCommentId) {
                    return {
                      ...c,
                      totalReplies: (Number(c.totalReplies) ?? 1) - 1,
                    };
                  }
                  return c;
                }),
              })),
            };
          },
        );
      },
    });

  const isUserComment = useMemo(
    () => reply.user?.id === user.id,
    [user, reply],
  );

  const onReplyEdit = useCallback(async () => {
    if (!reply.id || !user?.id) return;
    await editReply({ id: reply.id, content: editInputValue, userId: user.id });
  }, [reply, user, editReply, editInputValue]);

  const onReplyDelete = useCallback(async () => {
    if (!reply.id) return;
    await deleteReply({ replyId: reply.id });
  }, [reply, deleteReply]);

  return (
    <div
      className={cn(
        "transition-opacity flex-end flex w-full flex-col items-end ",
        (isDeletingReply || isDeletingParentComment) &&
          "opacity-50 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "relative flex flex-col gap-2 rounded-md border border-input bg-background p-4 w-11/12 justify-end ",
          className,
          isEditing && "p-4 border-primary shadow-md",
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
                  setTimeout(() => textAreaRef?.current?.textArea.focus(), 200);
                }}
              >
                <Edit size={16} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={onReplyDelete}
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
              userImage={reply?.user?.image}
              userName={reply?.user?.name}
              className="h-7 w-7 text-xs"
            />
            <p className="text-xs font-medium sm:text-sm">
              {reply?.user?.name ?? "John Doe"}
            </p>
          </div>

          <span className="text-xs text-gray-400 sm:text-sm font-light">
            <relative-time datetime={reply?.updatedAt?.toString()}>
              April 1, 2014
            </relative-time>
          </span>
        </div>
        {isEditing ? (
          <AutosizeTextarea
            ref={textAreaRef}
            minHeight={33}
            className={cn(
              "border-none resize-none font-light bg-accent/30 transition-opacity  focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:ring-transparent",
              isEditingReply && "cursor-wait opacity-50",
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
            {reply?.content ??
              "Just finished watching this video and I loved it! The production quality was top-notch, and the content was sFuer informative. Can&apos;t wait for more videos like this! 😄👍"}
          </p>
        )}
        <div className="flex flex-row gap-3">
          <Button
            variant="ghost"
            className="h-6 px-0 py-0 text-xs font-normal text-gray-600 hover:bg-transparent"
          >
            <Heart size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">11 Likes</span>
          </Button>
        </div>
        {isEditing && (
          <div className="absolute bottom-3 right-3 space-x-1 sm:block">
            <Button
              variant="accent"
              size="sm"
              className="w-9 h-8 px-0 text-sm sm:w-fit sm:px-3"
              type="button"
              disabled={isEditingReply}
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
              disabled={isEditingReply}
              onClick={onReplyEdit}
            >
              <span className="hidden sm:inline-block">Update</span>
              <SendHorizonal size={14} className="sm:hidden" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
