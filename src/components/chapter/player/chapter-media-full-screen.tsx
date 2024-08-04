import { cn } from "@/lib/utils";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { FullscreenIcon } from "@/components/ui/icons";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import {
  MediaActionTypes,
  useMediaDispatch,
  useMediaSelector,
} from "media-chrome/react/media-store";
import { useEffect, useState } from "react";
import { useChapterContext } from "../chapter-context";
import {
  topButtonClassname,
  topButtonIconFillClassname,
} from "../desktop/desktop-chapter-player";

export const ChapterMediaFullScreen = () => {
  const { isMobile } = useDeviceType();
  const isFullscreen = useMediaSelector((state) => state.mediaIsFullscreen);
  const dispatch = useMediaDispatch();
  const [originalOrientation, setOriginalOrientation] =
    useState<OrientationType>();
  const { setActiveTab } = useChapterContext();

  const toggleFullscreen = () => {
    // if (!isFullscreen) {
    //   setActiveTab(null);

    // }
    dispatch({
      type: isFullscreen
        ? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
        : MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST,
    });

    // if (!isMobile) return;

    // if (!isFullscreen) {
    //   console.log({ screen: screen.orientation.type });
    //   setOriginalOrientation(screen.orientation.type);

    //   if (screen.orientation.lock) {
    //     screen.orientation.lock("portrait");
    //   }
    // } else {
    //   screen.orientation.lock(originalOrientation?.split("-")[0]);
    // }
  };

  useEffect(() => {
    setOriginalOrientation(screen.orientation.type);
  }, []);

  return (
    <ResponsiveTooltip>
      <ResponsiveTooltipTrigger asChild>
        <button
          className={cn(topButtonClassname, "flex items-center justify-center")}
          type="button"
          onClick={toggleFullscreen}
        >
          <FullscreenIcon className={topButtonIconFillClassname} />
        </button>
      </ResponsiveTooltipTrigger>
      <ResponsiveTooltipContent
        side="bottom"
        align="center"
        sideOffset={4}
        className="p-1 px-2 border-transparent bg-foreground/70 dark:bg-background/70"
      >
        <p className="font-sans text-sm text-background dark:text-foreground">
          Fullscreen
        </p>
      </ResponsiveTooltipContent>
    </ResponsiveTooltip>
  );
};
