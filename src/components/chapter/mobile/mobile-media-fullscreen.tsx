import { FullscreenIcon, FullscreenMinimizeIcon } from "@/components/ui/icons";
import { MediaFullscreenButton } from "media-chrome/react";

export const MobileMediaFullscreen = () => {
  return (
    <MediaFullscreenButton class="h-8 w-fit px-2 pr-0 bg-transparent flex flex-row items-center justify-center gap-2">
      <span slot="enter">
        <FullscreenIcon className="w-4 h-4 text-background dark:text-foreground" />
      </span>
      <span slot="exit">
        <FullscreenMinimizeIcon className="w-4 h-4 text-background dark:text-foreground" />
      </span>
    </MediaFullscreenButton>
  );
};
