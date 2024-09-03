"use client";

import { cn } from "@/lib/utils/cn";

import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";

import { Button } from "@/components/ui/button";
import type { Icon } from "../../ui/icons/icons.type";

export const chapterButtonClassname = cn(
  "group/chapter-button px-2 flex items-center justify-center gap-2 pointer-events-auto",
);

export const chapterButtonIconClassname = cn("w-7 h-7 lg:w-9 lg:h-9 ");

export const ChapterButton = ({
  icon: Icon,
  label,
  lastButton = false,
  ...rest
}: { icon: Icon; label: string; lastButton?: boolean }) => {
  return (
    <ResponsiveTooltip>
      <ResponsiveTooltipTrigger asChild>
        <Button
          variant={"text-ghost"}
          className={cn(chapterButtonClassname, lastButton && "pr-0")}
          {...rest}
        >
          <Icon className={cn(chapterButtonIconClassname)} />
        </Button>
      </ResponsiveTooltipTrigger>
      <ResponsiveTooltipContent
        side="top"
        align="center"
        className="p-1 px-2 border-transparent bg-foreground/70 dark:bg-background/70"
      >
        <p className="text-sm  text-background dark:text-foreground">{label}</p>
      </ResponsiveTooltipContent>
    </ResponsiveTooltip>
  );
};
