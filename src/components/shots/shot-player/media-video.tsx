import { cn } from "@/lib/utils";
import MuxVideo from "@mux/mux-video-react";
import { useMediaRef } from "media-chrome/react/media-store";
import { useDeviceType } from "../../ui/device-only/device-only-provider";
import type { ShotProps } from "../shot";

export const MediaVideo = ({ shot }: ShotProps) => {
  const { deviceType } = useDeviceType();
  const mediaRef = useMediaRef();
  return (
    <MuxVideo
      ref={mediaRef}
      className={cn(
        "h-full",
        deviceType === "mobile" &&
          "landscape::aspect-[9/16] portrait:object-cover",
      )}
      playbackId={shot.playbackId}
      slot="media"
      loop
    />
  );
};
