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
  PauseIcon,
  PlayIcon,
  SkipBackward10Icon,
  SkipForward10Icon,
} from "@/components/ui/icons";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useChapterContext } from "../chapter-context";
import { ChapterMediaVideo } from "../player/chapter-media-video";
import { MobileMediaFullscreen } from "./mobile-media-fullscreen";

// const MediaControlBar = dynamic(
//   () => import("media-chrome/react").then((mod) => mod.MediaControlBar),
//   {
//     ssr: false,
//   },
// );

// const MediaController = dynamic(
//   () => import("media-chrome/react").then((mod) => mod.MediaController),
//   {
//     ssr: false,
//   },
// );

// const MediaPlayButton = dynamic(
//   () => import("media-chrome/react").then((mod) => mod.MediaPlayButton),
//   {
//     ssr: false,
//   },
// );

// const MediaSeekBackwardButton = dynamic(
//   () => import("media-chrome/react").then((mod) => mod.MediaSeekBackwardButton),
//   {
//     ssr: false,
//   },
// );

// const MediaSeekForwardButton = dynamic(
//   () => import("media-chrome/react").then((mod) => mod.MediaSeekForwardButton),
//   {
//     ssr: false,
//   },
// );

// const MediaTimeDisplay = dynamic(
//   () => import("media-chrome/react").then((mod) => mod.MediaTimeDisplay),
//   {
//     ssr: false,
//   },
// );

const centerButtonClassname = cn(
  "shrink-0 h-12 w-12 rounded-full  delay-0 bg-transparent group/chapter-play",
);

const centerButtonIconClassname = cn(
  "h-8 w-8 md:h-12 md:w-12 transition-colors fill-background dark:fill-foreground",
  "group-hover/chapter-play:fill-background dark:group-hover/chapter-play:fill-foreground",
);

export const MobileChapterPlayer = () => {
  const { autoPlay, setAutoPlay, chapter, program } = useChapterContext();

  return (
    <MediaController
      autohide="1"
      class={cn(
        "block w-full h-[var(--aspect-ratio-height)] z-10 bg-black overflow-hidden",
        "relative top-0 left-0",
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 pointer-events-none z-0" />

      <ChapterMediaVideo />
      <MediaControlBar
        class={cn(
          "relative z-10 w-[92%] lg flex items-center justify-between mt-[2%] mx-auto gap-1",
        )}
        slot="top-chrome"
      >
        <Button
          variant={"ghost"}
          size={"icon"}
          className="h-8 w-fit px-3 pl-0 bg-transparent flex flex-row items-center justify-center gap-2"
          asChild
        >
          <Link href={`/programs/${program.slug}`}>
            <ArrowLeftIcon className="w-4 h-4 text-background dark:text-foreground" />
            <p className="text-xs text-white font-medium ">{program.title}</p>
          </Link>
        </Button>
        <div className="flex flex-row items-center gap-2">
          <Switch
            checked={autoPlay}
            onCheckedChange={setAutoPlay}
            className="h-2 w-5 data-[state=checked]:bg-primary data-[state=unchecked]:bg-dark-accent/90"
            thumbClassName={cn(
              "flex w-4 h-4 items-center justify-center bg-background dark:bg-foreground text-foreground dark:text-background",
              " data-[state=checked]:translate-x-[calc(100%-10px)] data-[state=unchecked]:-translate-x-[10px]",
            )}
          >
            {autoPlay ? (
              <PlayIcon className="w-[10px] h-[10px]" />
            ) : (
              <PauseIcon className="w-[10px] h-[10px]" />
            )}
          </Switch>
          <MobileMediaFullscreen />
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
          class={cn("bg-transparent font-sans p-0  xl:text-base  text-xs")}
        />
        <MediaTimeRange />
      </MediaControlBar>
    </MediaController>
  );
};
