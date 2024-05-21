import { MediaTimeRange as MediaTimeRangeChrome } from "media-chrome/react";

import { cn } from "@/lib/utils";

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
