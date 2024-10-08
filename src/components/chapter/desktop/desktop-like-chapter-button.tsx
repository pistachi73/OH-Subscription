"use client";

import { cn } from "@/lib/utils/cn";

import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";

import { HeartIcon } from "@/components/ui/icons";
import { LikeButton } from "@/components/ui/like-button";
import { useChapterContext } from "../chapter-context";
import {
  chapterButtonClassname,
  chapterButtonIconClassname,
} from "./chapter-button";

export const DesktopLikeChapterButton = ({
  className,
}: { className?: string }) => {
  const { chapter, isLikedByUser, isLikeLoading, like } = useChapterContext();
  return (
    <ResponsiveTooltip>
      <ResponsiveTooltipTrigger asChild>
        <LikeButton
          variant={"text-ghost"}
          isLikeLoading={isLikeLoading}
          isLikedByUser={isLikedByUser ?? false}
          like={() => like({ videoId: chapter.id })}
          className={cn(
            "p-0 bg-transparent hover:bg-transparent",
            chapterButtonClassname,
            className,
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
