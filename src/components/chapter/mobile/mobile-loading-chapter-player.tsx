"use client";

import { cn } from "@/lib/utils";

import { SpinnerIcon } from "@/components/ui/icons";
import { useMobileHeaderHide } from "@/hooks/use-mobile-header-hide";

export const MobileLoadingChapterPlayer = () => {
  const { isHidden } = useMobileHeaderHide();

  return (
    <div
      className={cn(
        "block w-full h-[var(--aspect-ratio-height)] z-10 transition-transform ease-in-out duration-300 bg-black overflow-hidden",
        "flex items-center justify-center",
        isHidden ? "-translate-y-12" : "translate-y-0",
        "sticky top-12 left-0 sm:relative sm:top-0 sm:left-0",
        "sm:translate-y-0",
      )}
    >
      <SpinnerIcon className="h-8 w-8 md:h-12 md:w-12  animate-spin fill-white" />
    </div>
  );
};
