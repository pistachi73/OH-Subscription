import { cn } from "@/lib/utils";
import MuxVideo from "@mux/mux-video-react";
import { useMediaRef } from "media-chrome/react/media-store";
import type { ChapterProps } from "../chapter";

export const ChapterMediaVideo = ({ chapter }: ChapterProps) => {
  const mediaRef = useMediaRef();
  return (
    <MuxVideo
      ref={mediaRef}
      className={cn(
        "h-full object-contain",
        // deviceType === "mobile" &&
        //   "landscape::aspect-[9/16] portrait:object-cover",
      )}
      playbackId={"3dXbin4ef01o00yT02rlAT3afe4o01a2Sgp2weX2XSSon9E"}
      slot="media"
    />
  );
};
