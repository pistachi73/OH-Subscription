"use client";

import { cn } from "@/lib/utils/cn";
import { MediaTimeRange as MediaTimeRangeChrome } from "media-chrome/react";

export const MediaTimeRange = () => {
  return (
    <MediaTimeRangeChrome
      class={cn(
        "w-full",
        "[--media-range-padding:0px]",
        "[--media-range-track-border-radius:8px]",
        "[--media-control-background:transparent]",
        "[--media-control-hover-background:transparent]",
        "[--media-preview-thumbnail-background:transparent]",
        "[--media-primary-color:#ec6b05]",
        "[--media-control-height:4px]",
        "[--media-range-track-height:4px]",
        "[--media-range-thumb-height:12px]",
        "[--media-range-thumb-width:12px]",
      )}
    />
  );
};
