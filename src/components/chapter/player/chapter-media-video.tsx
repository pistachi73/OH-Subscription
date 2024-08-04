import MuxVideo from "@mux/mux-video-react";
import { useMediaRef } from "media-chrome/react/media-store";
import { useSearchParams } from "next/navigation";

export const ChapterMediaVideo = () => {
  const mediaRef = useMediaRef();
  const searchParams = useSearchParams();

  const startTime = searchParams.get("start") ?? undefined;

  return (
    <MuxVideo
      ref={mediaRef}
      className="w-full object-contain max-h-screen aspect-video min-h-full"
      playbackId={"5jVIM4eer5XH9gFjCAxNhvR9CBLIn00GkUOi6saqT5Is"}
      slot="media"
      startTime={startTime ? Number(startTime) : undefined}
    />
  );
};
