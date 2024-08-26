"use client";

import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaVolumeRange,
} from "media-chrome/react";

import { cn } from "@/lib/utils/cn";

import { DeviceOnly } from "@/components/ui/device-only/device-only";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import {
  PauseIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerMediumIcon,
  SpeakerOffIcon,
} from "@/components/ui/icons";
import type { ShotProps } from "../shot/index";
import { MediaFullScreenPlayButton } from "./media-full-screen-play-button";
import { MediaTimeRange } from "./media-time-range";
import { MediaVideo } from "./media-video";

export const ShotPlayer = ({ shot }: ShotProps) => {
  const { isMobile } = useDeviceType();

  return (
    <MediaController class="h-full w-full">
      <MediaVideo shot={shot} />
      <DeviceOnly allowedDevices={"mobile"}>
        <MediaFullScreenPlayButton />
        <MediaControlBar
          slot="centered-chrome"
          class="w-full flex items-center justify-center z-10 pointer-events-none"
        >
          <MediaPlayButton class="pointer-events-auto h-20 w-20 text-2xl rounded-full bg-foreground/70 dark:bg-background/70 text-background">
            <div slot="play">
              <PlayIcon className="w-8 h-8 " />
            </div>
            <div slot="pause">
              <PauseIcon className="w-8 h-8 " />
            </div>
          </MediaPlayButton>
        </MediaControlBar>
      </DeviceOnly>

      <DeviceOnly allowedDevices={["desktop", "tablet"]}>
        <MediaControlBar
          class="flex w-full  p-3 z-10 items-center gap-1"
          slot="top-chrome"
        >
          <MediaPlayButton
            class={cn(
              "shrink-0 h-10 w-10 rounded-full bg-foreground/70 dark:bg-background/70  text-background delay-0",
              "hover:bg-foreground/90",
            )}
          >
            <div slot="play">
              <PlayIcon className="w-5 h-5 fill-white" />
            </div>
            <div slot="pause">
              <PauseIcon className="w-5 h-5 fill-white" />
            </div>
          </MediaPlayButton>
          <div
            className={cn(
              "group/volume flex w-fit flex-row overflow-hidden rounded-full items-center ",
              "hover:w-full",
            )}
          >
            <MediaMuteButton
              class={cn(
                "h-10 w-10 shrink-0 rounded-full bg-foreground/70 dark:bg-background/70  ",
                "hover:bg-foreground/90 group-hover/volume:rounded-r-none",
              )}
            >
              <span slot="off">
                <SpeakerOffIcon className="w-5 h-5" />
              </span>
              <span slot="low">
                <SpeakerLowIcon className="w-5 h-5" />
              </span>
              <span slot="medium">
                <SpeakerMediumIcon className="w-5 h-5" />
              </span>
              <span slot="high">
                <SpeakerHighIcon className="w-5 h-5" />
              </span>
            </MediaMuteButton>
            <MediaVolumeRange
              class={cn(
                "hidden w-full h-10 rounded-r-full  bg-foreground/70 px-4 text-background dark:bg-foreground/70",
                "hover:bg-foreground/90 dark:bg-background/90  group-hover/volume:inline-block",
              )}
            />
          </div>
        </MediaControlBar>
      </DeviceOnly>

      <MediaControlBar class="w-full flex items-center justify-center">
        <div
          className={cn(
            "w-full mb-0 transition-all duration-300 ease-in-out",
            !isMobile && "group-hover:mb-6 group-hover:w-[calc(100%-36px)]",
          )}
        >
          <MediaTimeRange />
        </div>
      </MediaControlBar>
    </MediaController>
  );
};
