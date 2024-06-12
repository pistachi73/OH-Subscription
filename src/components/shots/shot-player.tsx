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
import {
  MediaActionTypes,
  MediaProvider,
  useMediaDispatch,
  useMediaRef,
  useMediaSelector,
} from "media-chrome/react/media-store";

import { Pause, Play } from "lucide-react";
import { MediaTimeRange as MediaTimeRangeChrome } from "media-chrome/react";
import { DeviceOnly } from "../ui/device-only/device-only";

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

type ShotPlayerProps = {
  playbackId: string;
};

const Video = ({ playbackId }: ShotPlayerProps) => {
  const mediaRef = useMediaRef();
  return (
    <MuxVideo
      ref={mediaRef}
      className="aspect-[9/16] h-full w-full object-cover"
      playbackId={playbackId}
      slot="media"
      loop
    />
  );
};

const ScreenPlayButton = () => {
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector((state) => state.mediaPaused);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className="absolute top-0 left-0 w-full h-full z-0"
      onClick={() =>
        dispatch({
          type: mediaPaused
            ? MediaActionTypes.MEDIA_PLAY_REQUEST
            : MediaActionTypes.MEDIA_PAUSE_REQUEST,
        })
      }
    />
  );
};

export const ShotPlayer = ({ playbackId }: ShotPlayerProps) => {
  return (
    <MediaProvider>
      <MediaController class="aspect-[9/16] h-full w-full">
        <Video playbackId={playbackId} />
        <ScreenPlayButton />
        <DeviceOnly allowedDevices={"mobile"}>
          <MediaControlBar
            slot="centered-chrome"
            class="w-full flex items-center justify-center z-10"
          >
            <MediaPlayButton
              class={cn(
                "h-20 w-20 text-2xl shrink-0 rounded-full bg-foreground/70 dark:bg-background/70  text-background delay-0",
                "hover:bg-foreground/90",
              )}
            >
              <div slot="play">
                <Play size={30} className="fill-white stroke-white" />
              </div>
              <div slot="pause">
                <Pause size={30} className="fill-white stroke-white" />
              </div>
            </MediaPlayButton>
          </MediaControlBar>
        </DeviceOnly>
        <DeviceOnly allowedDevices={["desktop", "tablet"]}>
          <MediaControlBar class="flex w-full gap-3 p-3 z-10" slot="top-chrome">
            <MediaPlayButton
              class={cn(
                "shrink-0 h-12 w-12 rounded-full bg-foreground/70 dark:bg-background/70  text-background delay-0",
                "hover:bg-foreground/90",
              )}
            >
              <div slot="play">
                <Play size={20} className="fill-white stroke-white" />
              </div>
              <div slot="pause">
                <Pause size={20} className="fill-white stroke-white" />
              </div>
            </MediaPlayButton>
            <div
              className={cn(
                "group flex w-fit flex-row overflow-hidden rounded-full bg-foreground/70 dark:bg-background/70",
                "hover:w-full",
              )}
            >
              <MediaMuteButton
                class={cn(
                  "h-12 w-12 shrink-0 rounded-full bg-foreground/70 dark:bg-background/70  ",
                  "hover:bg-foreground/90",
                )}
              />
              <MediaVolumeRange
                class={cn(
                  "hidden w-full rounded-r-full  bg-foreground/70 px-4 text-background dark:bg-foreground/70",
                  "hover:bg-foreground/90 dark:bg-background/90  group-hover:inline-block",
                )}
              />
            </div>
          </MediaControlBar>
        </DeviceOnly>
        <MediaControlBar class="overflow-hidden">
          <MediaTimeRange />
        </MediaControlBar>
      </MediaController>
    </MediaProvider>
  );
};
