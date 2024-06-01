import MuxVideo from "@mux/mux-video-react";
import { MediaController } from "media-chrome/react";

export const ShotPreviewPlayer = () => {
  return (
    <MediaController class="aspect-[9/16] h-full w-full">
      <MuxVideo
        className="aspect-[9/16] h-full w-full"
        streamType="on-demand"
        playbackId="Fd8VFQRIKXAfKe3ec00hwBa00s2sGVvI9zhxKIZ5p5iLc"
        slot="media"
        loop
      />
    </MediaController>
  );
};
