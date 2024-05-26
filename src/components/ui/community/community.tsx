import { ChevronDown, User } from "lucide-react";
import { useState } from "react";

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
export const Community = () => {
  // Fetch comments
  const [sort, setSort] = useState("Sort");

  return (
    <>
      <div className="mb-4 flex flex-row items-center justify-between">
        <h2 className="text-lg font-medium lg:text-xl">Discussion (20)</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 px-4"
            >
              {sort}
              <ChevronDown size={16} />
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
      </div>
      <div className="w-full max-w-[750px] space-y-4">
        <div className="flex flex-row gap-3">
          <Avatar className="h-9 w-9 border border-gray-800 first:ml-0 hover:bg-gray-400 sm:h-10 sm:w-10">
            <AvatarImage src={undefined} />
            <AvatarFallback className="bg-white">
              <User className="text-gray-800" size={20} />
            </AvatarFallback>
          </Avatar>
          <AddComment
            placeholder="Add your comment..."
            containerClassName="w-full"
            className="min-h-[120px]"
            commentLabel="Comment"
          />
        </div>
        <Comment />
        <Comment isReply />
        <Comment />
        <div className="flex w-full items-center">
          <Button variant="ghost" size="sm" className=" w-fit">
            Load more
          </Button>
        </div>
      </div>
    </>
  );
};
