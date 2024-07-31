"use client";

import { cn } from "@/lib/utils";

import { SpinnerIcon } from "@/components/ui/icons";
import { useMobileHeaderHide } from "@/hooks/use-mobile-header-hide";

export const MobileLoadingChapterPlayer = () => {
  const { isHidden } = useMobileHeaderHide();

  return (
    <div
      className={cn(
        "block w-full h-[var(--aspect-ratio-height)] bg-black overflow-hidden",
        "flex items-center justify-center",
      )}
    >
      <SpinnerIcon className="h-8 w-8 md:h-12 md:w-12  animate-spin fill-white" />
    </div>
  );
};
