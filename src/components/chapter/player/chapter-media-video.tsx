import { cn } from "@/lib/utils";
import MuxVideo from "@mux/mux-video-react";
import { useMediaRef } from "media-chrome/react/media-store";

export const ChapterMediaVideo = () => {
  const mediaRef = useMediaRef();
  return (
    <MuxVideo
      ref={mediaRef}
      className={cn(
        "w-full object-contain max-h-screen aspect-video min-h-full ",
        // deviceType === "mobile" &&
        //   "landscape::aspect-[9/16] portrait:object-cover",
      )}
      playbackId={"mPtGAwdVak5efLNzTUoZkligfSAlyu01GdXFaRL46BQU"}
      slot="media"
    />
  );
};
