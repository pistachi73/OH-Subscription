"use client";

import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import { Edit, Heart, Menu, Reply, Trash, User } from "lucide-react";
import { useState } from "react";

import { AddComment } from "./add-comment";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type CommentProps = {
  userId?: string;
  parentCommentId?: string;
  commendId?: string;
  isReply?: boolean;
};

export const Comment = ({ isReply }: CommentProps) => {
  const [showReply, setShowReply] = useState(false);

  const ease = cubicBezier(0.23, 1, 0.6, 1);

  return (
    <div className={cn({ "flex-end flex w-full flex-col items-end": isReply })}>
      <div
        className={cn(
          "relative flex w-full flex-col  gap-2 rounded-md border border-slate-300 p-5 sm:gap-3 sm:p-6",
          {
            "w-11/12 justify-end sm:w-4/5": isReply,
            "w-full": !isReply,
          },
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2"
            >
              <Menu size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5} align="end" className="w-56">
            <DropdownMenuItem>
              <Edit size={16} className="mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash size={16} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-row items-center  gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border border-gray-800 first:ml-0 hover:bg-gray-400">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-white">
                <User className="text-gray-800" size={16} />
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium sm:text-base">John Doe</p>
          </div>
          <div className="flex flex-row items-center  gap-2 sm:gap-3">
            <p className="text-xs text-gray-600 sm:text-sm">2 hours ago</p>
            <p className="text-xs text-gray-600 sm:text-sm">Edited on Nov 19</p>
          </div>
        </div>
        <p className="max-w-[70ch] text-sm text-gray-800 sm:text-base">
          Just finished watching this video and I loved it! The production
          quality was top-notch, and the content was super informative.
          Can&apos;t wait for more videos like this! 😄👍
        </p>
        <div className="flex flex-row  gap-2 sm:gap-3">
          <Button
            variant="ghost"
            className="h-6 px-0 py-0 text-xs font-normal text-gray-600 hover:bg-transparent"
          >
            <Heart size={16} className="mr-2 " />
            11 Likes
          </Button>

          <Button
            variant="ghost"
            className="h-6 px-0 py-0 text-xs font-normal text-gray-600 hover:bg-transparent"
            onClick={() => {
              setShowReply(!showReply);
            }}
          >
            <Reply size={16} className="mr-2 " />
            Reply
          </Button>
          <Button
            variant="ghost"
            className="h-6 px-0 py-0 text-xs font-normal text-gray-600 hover:bg-transparent"
          >
            Show replies (2)
          </Button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {showReply && (
          <motion.div
            variants={{
              animate: {
                opacity: 1,
                y: 0,
                height: "auto",
                transition: {
                  ease,
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
                  ease,
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
                setShowReply(false);
              }}
              commentLabel="Reply"
              cancelLabel="Cancel"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
