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

import { DeviceOnly } from "@/components/ui/device-only/device-only";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";
import Link from "next/link";
import type { Icon } from "../../ui/icons/icons.type";
import type { ChapterProps } from "../chapter";
import { useChapterContext } from "../chapter-context";
import { ChapterMediaFullScreen } from "./chapter-media-full-screen";
import { ChapterMediaVideo } from "./chapter-media-video";

const centerButtonClassname = cn(
  "shrink-0 h-12 w-12 rounded-full  delay-0 bg-transparent group/chapter-play",
);

const centerButtonIconClassname = cn(
  "h-12 w-12 transition-colors fill-background/70 dark:fill-foreground/70",
  "group-hover/chapter-play:fill-background dark:group-hover/chapter-play:fill-foreground",
);

export const topButtonClassname = cn(
  "shrink-0 p-0 h-10 w-10 bg-transparent group/top-button",
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

export const ChapterPlayer = ({ chapter, program }: ChapterProps) => {
  const { isMobile } = useDeviceType();

  const { bottomButtons } = useChapterContext();

  return (
    <MediaController class="max-h-screen h-full w-full relative" autohide="1">
      <ChapterMediaVideo chapter={chapter} program={program} />
      <MediaControlBar
        class={cn(
          "w-[calc(100%-48px)] lg:w-[calc(100%-64px)] flex justify-end items-center my-3 mx-auto",
        )}
        slot="top-chrome"
      >
        <DeviceOnly allowedDevices={["desktop"]}>
          <Tooltip>
            <TooltipTrigger className="h-10 w-10 flex items-center justify-center">
              <MediaMuteButton class={cn(topButtonClassname)}>
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
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="center"
              sideOffset={0}
              className="px-2 border-transparent bg-foreground/70 dark:bg-background/70 h-[300px] w-10 p-0"
            >
              <MediaVolumeRange
                class={cn(
                  "origin-top-left h-10 rotate-90 translate-x-[40px] p-0 w-[300px] px-2    rounded-sm text-background bg-transparent",
                )}
              />
            </TooltipContent>
          </Tooltip>
        </DeviceOnly>

        <ChapterMediaFullScreen />

        <div className="w-[1.5px] h-5 bg-background/50 dark:bg-foreground/50 mx-2" />
        <Tooltip>
          <TooltipTrigger>
            <Link
              href={`/programs/${program.slug}`}
              className={cn(
                topButtonClassname,
                topButtonIconClassname,
                "flex items-center justify-center",
              )}
              type="button"
            >
              <X className={topButtonIconClassname} strokeWidth={1.5} />
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="center"
            sideOffset={4}
            className="p-1 px-2 border-transparent bg-foreground/70 dark:bg-background/70"
          >
            <p className="text-sm  text-background dark:text-foreground">
              Close player
            </p>
          </TooltipContent>
        </Tooltip>
      </MediaControlBar>
      <MediaControlBar
        slot="centered-chrome"
        class="w-full flex items-center justify-center z-10 pointer-events-none gap-16"
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
      <div className="relative z-10 w-full bg-gradient-to-t from-black/50 from-25% to-black/0 pt-[100px] lg:pt-[200px] pointer-events-none">
        <MediaControlBar class="mx-auto w-[calc(100%-48px)] lg:w-[calc(100%-64px)] flex flex-row justify-between gap-2 mb-5 items-end ">
          <div className="space-y-2">
            <h1
              className={cn(
                "font-semibold tracking-tighter text-background dark:text-foreground",
                isMobile ? "text-3xl" : "text-5xl",
              )}
            >
              {program.title}
            </h1>
            <h2 className="text-lg md:text-2xl font-medium tracking-tight text-background dark:text-foreground">
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
          </div>
        </MediaControlBar>

        <MediaControlBar class="w-full flex items-center justify-center xl:mb-6 mb-3">
          <div
            className={cn(
              "w-[calc(100%-48px)] lg:w-[calc(100%-64px)] flex flex-row gap-6 items-center",
            )}
          >
            <MediaTimeDisplay
              showduration
              class="bg-transparent font-inter p-0 h-10 text-base hidden xl:block"
            />
            <MediaTimeRange />
          </div>
        </MediaControlBar>
        <MediaControlBar class="mx-auto w-[calc(100%-48px)] lg:w-[calc(100%-64px)] flex justify-between mb-4 xl:hidden">
          <MediaTimeDisplay
            showduration
            class="bg-transparent font-inter p-0 h-10 text-base"
          />
          <div className=" flex-row gap-1 flex shrink-0">
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
          </div>
        </MediaControlBar>
      </div>
    </MediaController>
  );
};

const ChapterButton = ({
  icon: Icon,
  label,
  lastButton = false,
  ...rest
}: { icon: Icon; label: string; lastButton?: boolean }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "group/chapter-button px-2 flex items-center justify-center gap-2 pointer-events-auto",
            "h-10 rounded-md xl:px-3 text-sm",
            "text-background/70 dark:text-foreground/70 hover:text-background dark:hover:text-foreground",
            lastButton && "pr-0",
          )}
          {...rest}
        >
          <Icon className={cn("w-5 h-5 xl:w-8 xl:h-8 transition-colors")} />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="p-1 px-2 border-transparent bg-foreground/70 dark:bg-background/70"
      >
        <p className="text-sm  text-background dark:text-foreground">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};
