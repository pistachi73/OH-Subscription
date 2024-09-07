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
import Link from "next/link";

import { MediaTimeRange } from "@/components/shots/shot-player/media-time-range";
import {
  ArrowLeftIcon,
  PauseIcon,
  PlayIcon,
  SkipBackward10Icon,
  SkipForward10Icon,
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerMediumIcon,
  SpeakerOffIcon,
} from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";

import { buttonVariants } from "@/components/ui/button";
import { useEffect } from "react";
import { useChapterContext } from "../chapter-context";
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

export const topButtonIconFillClassname = cn("w-5 h-5");

export const DesktopChapterPlayer = () => {
  const { autoPlay, setAutoPlay, bottomButtons, chapter, program } =
    useChapterContext();

  useEffect(() => {
    return () => {
      console.log("resetting autoplay");
    };
  }, []);

  return (
    <MediaController autohide="1" class="w-full relative flex z-10">
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-black/50 pointer-events-none" />
      <ChapterMediaVideo />
      <MediaControlBar
        class={cn(
          "w-[calc(100%-64px)] flex justify-between items-center mt-4 mx-auto relative z-10",
        )}
        slot="top-chrome"
      >
        <ResponsiveTooltip>
          <ResponsiveTooltipTrigger>
            <Link
              aria-label="Close player"
              href={`/programs/${program.slug}`}
              className={cn(
                buttonVariants({ variant: "text-ghost" }),
                topButtonClassname,
                "flex items-center justify-center px-0",
              )}
              type="button"
            >
              <ArrowLeftIcon />
            </Link>
          </ResponsiveTooltipTrigger>
          <ResponsiveTooltipContent
            side="bottom"
            align="center"
            sideOffset={4}
            className="p-1 px-2 border-transparent bg-foreground/70 dark:bg-background/70"
          >
            <p className="text-sm  text-background dark:text-foreground">
              Back to program
            </p>
          </ResponsiveTooltipContent>
        </ResponsiveTooltip>
        <div className="flex items-center">
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
                class={cn(
                  buttonVariants({ variant: "text-ghost" }),
                  topButtonClassname,
                )}
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
                  <SpeakerMediumIcon
                    className={cn(topButtonIconFillClassname)}
                  />
                </span>
                <span slot="high">
                  <SpeakerHighIcon className={cn(topButtonIconFillClassname)} />
                </span>
              </MediaMuteButton>
            </PopoverTrigger>
            <PopoverContent
              withPortal={false}
              side="bottom"
              align="center"
              sideOffset={8}
              className="px-2 border-transparent bg-foreground/70 dark:bg-background/70 h-[300px] w-10 p-0 "
            >
              <MediaVolumeRange
                class={cn(
                  " h-10  translate-x-[38px] p-0 w-[300px]  origin-top-left rotate-90 px-2  rounded-sm text-background bg-transparent",
                )}
              />
            </PopoverContent>
          </Popover>
          <ChapterMediaFullScreen />
        </div>
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
      <div className="relative z-10 w-full pointer-events-none">
        <MediaControlBar class="mx-auto w-[calc(100%-64px)] flex items-center gap-6 mb-4 lg:mb-6">
          <MediaTimeDisplay class="text-foreground/70 bg-transparent font-sans p-0 text-sm lg:text-base" />
          <MediaTimeRange />
        </MediaControlBar>
        <MediaControlBar
          class={cn(
            "mb-6 lg:mb-8 mx-auto w-[calc(100%-64px)] flex justify-between items-center",
          )}
        >
          <h1
            className={cn(
              "truncate text-lg lg:text-xl text-background dark:text-foreground space-x-2 mr-4",
            )}
          >
            <ResponsiveTooltip>
              <ResponsiveTooltipTrigger asChild>
                <Link
                  className="font-semibold pointer-events-auto"
                  href={`/programs/${program.slug}`}
                >
                  {program.title}
                </Link>
              </ResponsiveTooltipTrigger>
              <ResponsiveTooltipContent
                side="bottom"
                align="center"
                className="text-lg"
                sideOffset={8}
              >
                Back to program
              </ResponsiveTooltipContent>
            </ResponsiveTooltip>
            <span className="font-normal">
              C{chapter.chapterNumber}: {chapter.title}
            </span>
          </h1>

          <div className="flex-row gap-1 flex shrink-0">
            {bottomButtons.map(({ icon, label, hidden, ...rest }, index) => {
              if (hidden) return null;
              return (
                <ChapterButton
                  key={label}
                  label={label}
                  icon={icon}
                  {...rest}
                />
              );
            })}
            <DesktopLikeChapterButton className="pr-0" />
          </div>
        </MediaControlBar>
      </div>
    </MediaController>
  );
};
