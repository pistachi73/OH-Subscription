import { cn } from "@/lib/utils";

import { FullscreenIcon } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MediaActionTypes,
  useMediaDispatch,
  useMediaSelector,
} from "media-chrome/react/media-store";
import { topButtonClassname, topButtonIconFillClassname } from ".";
import { useChapterContext } from "../chapter-context";

export const ChapterMediaFullScreen = () => {
  const isFullscreen = useMediaSelector((state) => state.mediaIsFullscreen);
  const dispatch = useMediaDispatch();
  const { setActiveTab } = useChapterContext();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(topButtonClassname, "flex items-center justify-center")}
          type="button"
          onClick={() => {
            if (!isFullscreen) {
              setActiveTab(null);
            }
            dispatch({
              type: isFullscreen
                ? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
                : MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST,
            });
          }}
        >
          <FullscreenIcon className={topButtonIconFillClassname} />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="center"
        sideOffset={4}
        className="p-1 px-2 border-transparent bg-foreground/70 dark:bg-background/70"
      >
        <p className="font-inter text-sm text-background dark:text-foreground">
          Fullscreen
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
