import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { cn } from "@/lib/utils";
import { LoadingShotPlayer } from "../shot-player/loading-shot-player";

export const LoadingShot = () => {
  const { isMobile } = useDeviceType();
  return (
    <div
      className={cn(
        "relative flex h-full translate-x-0 items-end  bg-background",
        isMobile ? "w-full" : "aspect-[9/16] w-auto rounded-md",
      )}
    >
      <div
        className={cn(
          "group relative w-full h-full",
          isMobile
            ? "rounded-none bg-foreground/80 dark:bg-background/80"
            : "rounded-2xl overflow-hidden",
        )}
      >
        <LoadingShotPlayer />
      </div>
    </div>
  );
};
