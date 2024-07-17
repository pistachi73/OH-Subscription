"use client";

import { cn } from "@/lib/utils";

import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";

import { LikeButton } from "@/components/programs/components/like-button";
import { HeartIcon } from "@/components/ui/icons";
import { useChapterContext } from "../chapter-context";
import {
  chapterButtonClassname,
  chapterButtonIconClassname,
} from "./chapter-button";

export const DesktopLikeChapterButton = () => {
  const { chapter, isLikedByUser, isLikeLoading, likeChapter } =
    useChapterContext();
  return (
    <ResponsiveTooltip>
      <ResponsiveTooltipTrigger asChild>
        <LikeButton
          isLikeLoading={isLikeLoading}
          isLikedByUser={isLikedByUser ?? false}
          likeProgram={() => likeChapter({ videoId: chapter.id })}
          className={cn(
            "p-0 bg-transparent hover:bg-transparent",
            chapterButtonClassname,
          )}
        >
          <HeartIcon
            className={cn(
              chapterButtonIconClassname,
              isLikedByUser && "text-red-500",
            )}
          />
        </LikeButton>
      </ResponsiveTooltipTrigger>
      <ResponsiveTooltipContent
        side="top"
        align="center"
        className="p-1 px-2 border-transparent bg-foreground/70 dark:bg-background/70"
      >
        <p className="text-sm  text-background dark:text-foreground">
          {isLikedByUser ? "Remove from favorites" : "Add to favorites"}
        </p>
      </ResponsiveTooltipContent>
    </ResponsiveTooltip>
  );
};
