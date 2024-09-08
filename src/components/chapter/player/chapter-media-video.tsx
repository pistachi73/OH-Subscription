import MuxVideo from "@mux/mux-video-react";
import { useMediaRef } from "media-chrome/react/media-store";
import { useSearchParams } from "next/navigation";
import { useChapterContext } from "../chapter-context";

export const ChapterMediaVideo = () => {
  const { chapter } = useChapterContext();
  const mediaRef = useMediaRef();
  const searchParams = useSearchParams();

  const startTime = searchParams.get("start") ?? undefined;

  if (!chapter.playbackToken) return null;

  return (
    <MuxVideo
      ref={mediaRef}
      className="w-full object-contain max-h-screen aspect-video min-h-full"
      playbackId={chapter.playbackId}
      tokens={{
        playback: chapter.playbackToken,
      }}
      slot="media"
      startTime={startTime ? Number(startTime) : undefined}
    />
  );
};
