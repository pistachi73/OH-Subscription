"use client";
import MuxVideo from "@mux/mux-video-react";
import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaVolumeRange,
} from "media-chrome/react";

import { cn } from "@/lib/utils";

import { MediaTimeRange as MediaTimeRangeChrome } from "media-chrome/react";

export const MediaTimeRange = () => {
  return (
    <MediaTimeRangeChrome
      class={cn(
        "[--media-range-padding:0px]",
        "[--media-range-track-border-radius:0]",
        "[--media-control-height:4px]",
        "[--media-control-background:transparent]",
        "[--media-control-hover-background:transparent]",
        "[--media-preview-thumbnail-background:transparent]",
        "[--media-range-thumb-background:transparent]",
        "[--media-primary-color:#ec6b05]",
      )}
    />
  );
};

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
        />
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
          />
          <MediaVolumeRange
            class={cn(
              "hidden w-full rounded-r-full  bg-foreground/70 px-4 text-background",
              "hover:bg-foreground/90 group-hover:inline-block",
            )}
          />
        </div>
      </MediaControlBar>
      <MediaControlBar class="overflow-hidden">
        <MediaTimeRange />
      </MediaControlBar>
    </MediaController>
  );
};
