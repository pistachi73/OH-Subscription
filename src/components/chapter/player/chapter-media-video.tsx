import MuxVideo from "@mux/mux-video-react";
import { useMediaRef } from "media-chrome/react/media-store";

export const ChapterMediaVideo = () => {
  const mediaRef = useMediaRef();

  return (
    <MuxVideo
      ref={mediaRef}
      className="w-full object-contain max-h-screen aspect-video min-h-full"
      playbackId={"QB01QeSvLsNNUfz01epLc01pGkcEmSRDvSZzQU8nz44qIM"}
      slot="media"
    />
  );
};
