"use client";

import {
  MediaControlBar,
  MediaController,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
} from "media-chrome/react";

import { cn } from "@/lib/utils";

import { MediaTimeRange } from "@/components/shots/shot-player/media-time-range";

import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
  SkipBackward10Icon,
  SkipForward10Icon,
} from "@/components/ui/icons";
import { Switch } from "@/components/ui/switch";
import { useMobileHeaderHide } from "@/hooks/use-mobile-header-hide";
import { useChapterContext } from "../chapter-context";
import { ChapterMediaVideo } from "../player/chapter-media-video";

const centerButtonClassname = cn(
  "shrink-0 h-12 w-12 rounded-full  delay-0 bg-transparent group/chapter-play",
);

const centerButtonIconClassname = cn(
  "h-8 w-8 md:h-12 md:w-12 transition-colors fill-background dark:fill-foreground",
  "group-hover/chapter-play:fill-background dark:group-hover/chapter-play:fill-foreground",
);

export const MobileChapterPlayer = () => {
  const { isHidden } = useMobileHeaderHide();
  const { autoPlay, setAutoPlay, chapter, program } = useChapterContext();

  return (
    <MediaController
      autohide="1"
      class={cn(
        "w-full h-[var(--aspect-ratio-height)] z-10 transition-transform ease-in-out duration-300 bg-black",
        isHidden ? "-translate-y-12" : "translate-y-0",
        "sticky top-12 left-0 sm:relative sm:top-0 sm:left-0",
        "sm:translate-y-0",
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 pointer-events-none z-0" />

      <ChapterMediaVideo chapter={chapter} program={program} />
      <MediaControlBar
        class={cn(
          "relative z-10 w-[92%] lg flex items-center justify-between mt-[3%] mx-auto gap-1",
        )}
        slot="top-chrome"
      >
        <Button
          variant={"ghost"}
          size={"icon"}
          className="h-8 w-fit px-3 pl-0 bg-transparent flex flex-row items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4 text-background dark:text-foreground" />
          <p className="text-xs text-white font-medium ">{program.title}</p>
        </Button>
        <div className="flex flex-row items-center gap-2">
          <Switch
            checked={autoPlay}
            onCheckedChange={setAutoPlay}
            className="h-3 w-6 data-[state=checked]:bg-primary data-[state=unchecked]:bg-dark-accent/90"
            thumbClassName={cn(
              "flex w-5 h-5 items-center justify-center bg-background dark:bg-foreground text-foreground dark:text-background",
              " data-[state=checked]:translate-x-[calc(100%-10px)] data-[state=unchecked]:-translate-x-[10px]",
            )}
          >
            {autoPlay ? (
              <PlayIcon className="w-3 h-3" />
            ) : (
              <PauseIcon className="w-3 h-3" />
            )}
          </Switch>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="h-8 w-fit px-3 pr-0 bg-transparent flex flex-row items-center justify-center gap-2"
          >
            <FullscreenIcon className="w-4 h-4 text-background dark:text-foreground" />
          </Button>
        </div>
      </MediaControlBar>
      <MediaControlBar
        slot="centered-chrome"
        class={cn(
          "relative gap-4 w-full flex items-center justify-center z-10 pointer-events-none",
        )}
      >
        <MediaSeekBackwardButton class={centerButtonClassname}>
          <div slot="icon">
            <SkipBackward10Icon className={centerButtonIconClassname} />
          </div>
        </MediaSeekBackwardButton>
        <MediaPlayButton class={centerButtonClassname}>
          <div slot="play">
            <PlayIcon className={centerButtonIconClassname} />
          </div>
          <div slot="pause">
            <PauseIcon className={centerButtonIconClassname} />
          </div>
        </MediaPlayButton>
        <MediaSeekForwardButton class={centerButtonClassname}>
          <div slot="icon">
            <SkipForward10Icon className={centerButtonIconClassname} />
          </div>
        </MediaSeekForwardButton>
      </MediaControlBar>
      {/* <div className="w-full h-full absolute top-0 left-0 bg-foreground/40 dark:bg-background/40 pointer-events-none " /> */}
      <MediaControlBar
        class={cn(
          "relative z-10 w-[92%] flex items-center gap-4 justify-center mx-auto h-8 mb-[3%]",
        )}
      >
        <MediaTimeDisplay
          class={cn("bg-transparent font-inter p-0  xl:text-base  text-xs")}
        />
        <MediaTimeRange />
      </MediaControlBar>
    </MediaController>
  );
};
