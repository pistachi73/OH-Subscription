import { Filter, User, X } from "lucide-react";
import { useState } from "react";

import { ShotSideWrapper } from "./shot-side-wrapper";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AddComment } from "@/components/ui/community/add-comment";
import { Comment } from "@/components/ui/community/comment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ShotCommunityProps = {
  showComments: boolean;
  setShowComments: (value: boolean) => void;
};

export const ShotCommunity = ({
  showComments,
  setShowComments,
}: ShotCommunityProps) => {
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
          "flex h-full w-full flex-col justify-between overflow-hidden",
          "xl:border xl:bg-accent/40",
          "sm:rounded-md",
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between border-b p-4 pt-0",
            "sm:pt-4",
          )}
        >
          <h2 className={cn("text-lg font-medium", "lg:text-xl")}>
            Discussion (20)
          </h2>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="inline"
                  className="flex items-center gap-2 p-1"
                >
                  <Filter size={20} />
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
            </DropdownMenu>
            <Button
              variant="ghost"
              size="inline"
              className="p-1"
              onClick={() => setShowComments(false)}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <div className="flex  max-h-full min-h-0 flex-col items-start gap-4  overflow-y-auto p-4">
            <Comment />
            <Comment />
            <Comment isReply />
            <Comment />
            <Comment />
            <Comment isReply />
          </div>
          <div className="border-t p-4">
            <div className="flex flex-row gap-3">
              <Avatar className="h-8 w-8 border  first:ml-0 hover:bg-gray-400">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-white">
                  <User className="text-gray-800" size={16} />
                </AvatarFallback>
              </Avatar>
              <AddComment
                placeholder="Add your comment..."
                containerClassName="w-full"
                className="min-h-[120px]"
                commentLabel="Comment"
              />
            </div>
          </div>
        </div>
      </div>
    </ShotSideWrapper>
  );
};
