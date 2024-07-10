import { cn } from "@/lib/utils";
import MuxVideo from "@mux/mux-video-react";
import { useMediaRef } from "media-chrome/react/media-store";

export const ChapterMediaVideo = () => {
  const mediaRef = useMediaRef();
  return (
    <MuxVideo
      ref={mediaRef}
      // poster="https://image.mux.com/WmUUjIIRSYxguY1n0218ygJNIT02FV669Jq02JEdlsxS02k/thumbnail.png?width=214&height=121&time=2"
      className={cn(
        "w-full object-contain max-h-screen aspect-video min-h-full ",
        // deviceType === "mobile" &&
        //   "landscape::aspect-[9/16] portrait:object-cover",
      )}
      playbackId={"WmUUjIIRSYxguY1n0218ygJNIT02FV669Jq02JEdlsxS02k"}
      slot="media"
    />
  );
};
