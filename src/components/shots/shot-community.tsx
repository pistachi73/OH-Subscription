import { Filter, SendHorizonal, User, X } from "lucide-react";
import { useState } from "react";

import { ShotSideWrapper } from "./shot-side-wrapper";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AddComment } from "../ui/comments/add-comment";
import { Comment } from "../ui/comments/comment";
import { DeviceOnly } from "../ui/device-only/device-only";

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
          "flex h-full w-full flex-col",
          "xl:border xl:bg-background",
          "sm:rounded-md",
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between border-b p-3 pt-0",
            "sm:p-4",
          )}
        >
          <h2 className={cn("text-base font-medium sm:text-lg", "lg:text-xl")}>
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
            <DeviceOnly allowedDevices={["tablet", "desktop"]}>
              <Button
                variant="ghost"
                size="inline"
                className="p-1"
                onClick={() => setShowComments(false)}
              >
                <X size={20} />
              </Button>
            </DeviceOnly>
          </div>
        </div>
        <div className="flex flex-col justify-end h-full basis-auto overflow-y-auto">
          <div className="flex  max-h-full min-h-0 flex-col items-start gap-4  overflow-y-auto p-4">
            <Comment className="p-0 border-transparent" />
            <Comment className="p-0 border-transparent" />
          </div>
          <div className="border-t p-4">
            <div className="flex flex-row gap-3">
              <Avatar className="h-8 w-8 border  first:ml-0 hover:bg-gray-400">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-white">
                  <User className="text-gray-800" size={16} />
                </AvatarFallback>
              </Avatar>
              <AddComment containerClassName="w-full" className="p-2" />
              <div className="mb-1 flex items-end justify-end">
                <SendHorizonal size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShotSideWrapper>
  );
};
