"use client";
import MuxVideo from "@mux/mux-video-react";
import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPipButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaVolumeRange,
} from "media-chrome/react";

import { MediaTimeRange } from "./media-time-range";

import { cn } from "@/lib/utils";

export const ShotPlayer = () => {
  return (
    <MediaController class="aspect-[9/16] h-full w-full">
      <MuxVideo
        className="aspect-[9/16] h-full w-full"
        streamType="on-demand"
        playbackId="vUoE57Q501o01wP4r7AXNUStoWCLYgPxQdu22UD9wuu8s"
        slot="media"
        loop
      />

      <MediaControlBar class="flex w-full gap-3 p-3" slot="top-chrome">
        <MediaPlayButton
          class={cn(
            "shrink-0 rounded-full bg-foreground/70 text-background delay-0",
            "hover:bg-foreground/90",
          )}
        ></MediaPlayButton>
        <div
          className={cn(
            "group flex w-fit flex-row overflow-hidden rounded-full",
            "hover:w-full",
          )}
        >
          <MediaMuteButton
            class={cn(
              "shrink-0 rounded-full bg-foreground/70",
              "hover:bg-foreground/90",
            )}
          ></MediaMuteButton>
          <MediaVolumeRange
            class={cn(
              "hidden w-full rounded-r-full  bg-foreground/70 px-4 text-background",
              "hover:bg-foreground/90 group-hover:inline-block",
            )}
          ></MediaVolumeRange>
        </div>
      </MediaControlBar>
      <MediaControlBar class="overflow-hidden">
        <MediaTimeRange />
      </MediaControlBar>
    </MediaController>
  );
};
