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
        "w-full object-contain max-h-screen aspect-video min-h-full ",
        // deviceType === "mobile" &&
        //   "landscape::aspect-[9/16] portrait:object-cover",
      )}
      playbackId={"CEFyhtKTvLs9mayHn7mg028XlsE3T9rS9tiSXeo01uw100"}
      slot="media"
    />
  );
};
