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
import { Edit, EllipsisVertical, Heart, Trash } from "lucide-react";
import { useCallback, useMemo } from "react";
import { UserAvatar } from "../user-avatar";
import { COMMENTS_PAGE_SIZE } from "./comment";

type ReplyProps = {
  reply: ReplyData;
  parentCommentId: number;
  programId?: number;
  videoId?: number;
};

export const Reply = ({
  reply,
  parentCommentId,
  programId,
  videoId,
}: ReplyProps) => {
  const user = useCurrentUser();
  const apiUtils = api.useUtils();
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

        apiUtils.comment.getByProgramIdOrVideoId.invalidate({
          pageSize: COMMENTS_PAGE_SIZE,
          ...(programId && { programId }),
          ...(videoId && { videoId }),
        });
      },
    });

  const isUserComment = useMemo(
    () => reply.user?.id === user.id,
    [user, reply],
  );

  const onReplyDelete = useCallback(async () => {
    if (!reply.id) return;
    await deleteReply({ replyId: reply.id });
  }, [reply, deleteReply]);

  return (
    <div
      className={cn(
        "transition-opacity flex-end flex w-full flex-col items-end ",
        isDeletingReply && "opacity-50 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "relative flex flex-col gap-2  rounded-md border border-input bg-background p-4 w-11/12 justify-end ",
          "sm:gap-3",
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
        <p className="max-w-[70ch] text-xs text-gray-800 sm:text-sm">
          {reply?.id}
          {" - "}
          {reply?.updatedAt?.toISOString()} {" - "}
          {reply?.content ??
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
        </div>
      </div>
    </div>
  );
};
