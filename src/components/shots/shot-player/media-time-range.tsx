"use client";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { cn } from "@/lib/utils";
import { MediaTimeRange as MediaTimeRangeChrome } from "media-chrome/react";

export const MediaTimeRange = () => {
  const { deviceType } = useDeviceType();
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
        deviceType === "mobile"
          ? "[--media-control-height:4px]"
          : "[--media-control-height:6px]",
        deviceType === "mobile"
          ? "[--media-range-track-height:4px]"
          : "[--media-range-track-height:6px]",
        deviceType === "mobile"
          ? "[--media-range-thumb-height:10px]"
          : "[--media-range-thumb-height:16px]",
        deviceType === "mobile"
          ? "[--media-range-thumb-width:10px]"
          : "[--media-range-thumb-width:16px]",
      )}
    />
  );
};
