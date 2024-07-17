"use client";

import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaVolumeRange,
} from "media-chrome/react";

import { cn } from "@/lib/utils";

import { MediaTimeRange } from "@/components/shots/shot-player/media-time-range";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";

import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";

import {
  PauseIcon,
  PlayIcon,
  SkipBackward10Icon,
  SkipForward10Icon,
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerMediumIcon,
  SpeakerOffIcon,
} from "@/components/ui/icons";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { PopoverContent } from "@radix-ui/react-popover";
import { X } from "lucide-react";
import Link from "next/link";
import { useChapterContext } from "../chapter-context";
import { useLikeChapter } from "../hooks/use-like-chapter";
import { ChapterMediaFullScreen } from "../player/chapter-media-full-screen";
import { ChapterMediaVideo } from "../player/chapter-media-video";
import { ChapterButton } from "./chapter-button";
import { DesktopLikeChapterButton } from "./desktop-like-chapter-button";

const centerButtonClassname = cn(
  "shrink-0 h-12 w-12 rounded-full  delay-0 bg-transparent group/chapter-play",
);

const centerButtonIconClassname = cn(
  "h-8 w-8 md:h-12 md:w-12 transition-colors fill-background/70 dark:fill-foreground/70",
  "group-hover/chapter-play:fill-background dark:group-hover/chapter-play:fill-foreground",
);

export const topButtonClassname = cn(
  "shrink-0 p-0 h-10 px-2 bg-transparent group/top-button",
);

export const topButtonIconClassname = cn(
  "transition-colors text-background/70 dark:text-foreground/70",
  "group-hover/top-button:text-background dark:group-hover/top-button:text-foreground",
);

export const topButtonIconFillClassname = cn(
  "w-5 h-5",
  "transition-colors fill-background/70 dark:fill-foreground/70",
  "group-hover/top-button:fill-background dark:group-hover/top-button:fill-foreground",
);

export const DesktopChapterPlayer = () => {
  const { isMobile } = useDeviceType();

  const { autoPlay, setAutoPlay, bottomButtons, activeTab, chapter, program } =
    useChapterContext();

  const { isLikedByUser, isLikeLoading, likeChapter } = useLikeChapter({
    initialLiked: chapter.isLikedByUser,
  });

  return (
    <MediaController autohide="1" class="w-full relative flex z-10">
      <ChapterMediaVideo />
      <MediaControlBar
        class={cn(
          "w-[calc(100%-48px)] lg:w-[calc(100%-64px)] flex justify-end items-center my-3 mx-auto",
        )}
        slot="top-chrome"
      >
        <Switch
          checked={autoPlay}
          onCheckedChange={setAutoPlay}
          className="h-7 mr-2 data-[state=checked]:bg-primary data-[state=unchecked]:bg-dark-accent/90"
          thumbClassName="w-5 h-5  flex items-center justify-center bg-background/70 dark:bg-foreground/70 text-foreground/70 dark:text-background/70"
        >
          {autoPlay ? (
            <PlayIcon className="w-3 h-3" />
          ) : (
            <PauseIcon className="w-3 h-3" />
          )}
        </Switch>
        <Popover>
          <PopoverTrigger className="h-10 w-10 flex items-center justify-center">
            <MediaMuteButton
              class={cn(topButtonClassname)}
              onClick={() => {
                console.log("clicked");
              }}
              disabled
            >
              <span slot="off">
                <SpeakerOffIcon className={cn(topButtonIconFillClassname)} />
              </span>
              <span slot="low">
                <SpeakerLowIcon className={cn(topButtonIconFillClassname)} />
              </span>
              <span slot="medium">
                <SpeakerMediumIcon className={cn(topButtonIconFillClassname)} />
              </span>
              <span slot="high">
                <SpeakerHighIcon className={cn(topButtonIconFillClassname)} />
              </span>
            </MediaMuteButton>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="center"
            sideOffset={8}
            className="px-2 border-transparent bg-foreground/70 dark:bg-background/70 h-[300px] w-10 p-0 "
          >
            <MediaVolumeRange
              class={cn(
                " h-10  translate-x-[32.5px] p-0 w-[300px]  origin-top-left rotate-90 px-2  rounded-sm text-background bg-transparent",
              )}
            />
          </PopoverContent>
        </Popover>

        <ChapterMediaFullScreen />

        <div className="w-[1.5px] h-5 bg-background/50 dark:bg-foreground/50 mx-2" />
        <ResponsiveTooltip>
          <ResponsiveTooltipTrigger>
            <Link
              aria-label="Close player"
              href={`/programs/${program.slug}`}
              className={cn(
                topButtonClassname,
                topButtonIconClassname,
                "flex items-center justify-center pr-0",
              )}
              type="button"
            >
              <X className={cn(topButtonIconClassname)} strokeWidth={1.5} />
            </Link>
          </ResponsiveTooltipTrigger>
          <ResponsiveTooltipContent
            side="bottom"
            align="center"
            sideOffset={4}
            className="p-1 px-2 border-transparent bg-foreground/70 dark:bg-background/70"
          >
            <p className="text-sm  text-background dark:text-foreground">
              Close player
            </p>
          </ResponsiveTooltipContent>
        </ResponsiveTooltip>
      </MediaControlBar>
      <MediaControlBar
        slot="centered-chrome"
        class={cn(
          "w-full flex items-center justify-center z-10 pointer-events-none gap-16",
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
      <div className="relative z-10 w-full bg-gradient-to-t from-black/50 from-25% to-black/0 pt-[100px] lg:pt-[200px] pointer-events-none">
        <MediaControlBar
          class={cn(
            "mx-auto w-[calc(100%-48px)] lg:w-[calc(100%-64px)] flex flex-row justify-between items-end",
            isMobile ? "mb-3" : "mb-5",
          )}
        >
          <div className={cn(isMobile ? "space-y-0" : "space-y-2")}>
            <h1
              className={cn(
                "font-semibold tracking-tighter text-background dark:text-foreground",
                isMobile ? "text-2xl" : "text-4xl",
              )}
            >
              {program.title}
            </h1>
            <h2
              className={cn(
                "font-medium tracking-tight text-background dark:text-foreground",
                isMobile ? "text-base" : "text-2xl",
              )}
            >
              C{chapter.chapterNumber}: {chapter.title}
            </h2>
          </div>
          <div className=" flex-row gap-1 hidden xl:flex shrink-0">
            {bottomButtons.map(({ icon, label, ...rest }, index) => {
              if (label === "Transcript" && !chapter.transcript) return null;
              return (
                <ChapterButton
                  key={label}
                  label={label}
                  icon={icon}
                  lastButton={index === bottomButtons.length - 1}
                  {...rest}
                />
              );
            })}
            <DesktopLikeChapterButton />
          </div>
        </MediaControlBar>
        <MediaControlBar
          class={cn("w-full flex items-center justify-center xl:mb-6 mb-3")}
        >
          <div
            className={cn(
              "w-[calc(100%-48px)] lg:w-[calc(100%-64px)] flex flex-row items-center gap-6",
            )}
          >
            <MediaTimeDisplay
              class={cn(
                "bg-transparent font-inter p-0  xl:text-base  hidden text-base",
              )}
            />
            <MediaTimeRange />
          </div>
        </MediaControlBar>
        <MediaControlBar
          class={cn(
            "mx-auto w-[calc(100%-48px)] lg:w-[calc(100%-64px)] flex justify-between xl:hidden",
            isMobile ? "mb-1" : "mb-4",
          )}
        >
          <MediaTimeDisplay
            showduration
            class="bg-transparent font-inter p-0 h-10 text-sm text-foreground/70"
          />
          <div className=" flex-row gap-1 flex shrink-0">
            {bottomButtons.map(({ icon, label, hidden, ...rest }, index) => {
              if (hidden) return null;
              return (
                <ChapterButton
                  key={label}
                  label={label}
                  icon={icon}
                  lastButton={index === bottomButtons.length - 1}
                  {...rest}
                />
              );
            })}
            <DesktopLikeChapterButton />
          </div>
        </MediaControlBar>
      </div>
    </MediaController>
  );
};
