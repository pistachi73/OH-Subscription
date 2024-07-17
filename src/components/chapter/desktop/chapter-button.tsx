"use client";

import { cn } from "@/lib/utils";

import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";

import type { Icon } from "../../ui/icons/icons.type";

export const chapterButtonClassname = cn(
  "group/chapter-button px-2 flex items-center justify-center gap-2 pointer-events-auto",
  "h-10 rounded-md xl:px-3 text-sm",
  "text-foreground/70 hover:text-foreground/60",
);

export const chapterButtonIconClassname = cn("w-7 h-7 xl:w-8 xl:h-8 ");

export const ChapterButton = ({
  icon: Icon,
  label,
  lastButton = false,
  ...rest
}: { icon: Icon; label: string; lastButton?: boolean }) => {
  return (
    <ResponsiveTooltip>
      <ResponsiveTooltipTrigger asChild>
        <button
          type="button"
          className={cn(chapterButtonClassname, lastButton && "pr-0")}
          {...rest}
        >
          <Icon className={cn(chapterButtonIconClassname)} />
        </button>
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
