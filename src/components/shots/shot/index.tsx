"use client";
import { motion } from "framer-motion";

import { ShotCommunity } from "./shot-community";
import { ShotTranscript } from "./shot-transcript";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { cn } from "@/lib/utils";
import type { ShotCarouselData } from "@/server/db/schema.types";
import "media-chrome";
import { MediaProvider } from "media-chrome/react/media-store";
import { ShotPlayer } from "../shot-player";
import { ShotContextProvider, useShotContext } from "./shot-context";
import { ShotLayout } from "./shot-layout";

export type ShotProps = {
  shot: NonNullable<ShotCarouselData>;
};

export const Shot = ({ shot }: ShotProps) => {
  return (
    <ShotContextProvider>
      <MediaProvider>
        <ShotContent shot={shot} />
      </MediaProvider>
    </ShotContextProvider>
  );
};

const ShotContent = ({ shot }: { shot: NonNullable<ShotCarouselData> }) => {
  const { showComments, showTranscript } = useShotContext();
  const { deviceSize, isMobile } = useDeviceType();

  const isDesktop = deviceSize.includes("xl");
  const canAnimate = showComments || showTranscript;

  return (
    <motion.div
      // Half of the width of the comments section
      animate={{
        x: isDesktop && canAnimate ? "max(-250px, -50%)" : 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
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
          !isMobile && (showComments || showTranscript) ? "rounded-r-none" : "",
        )}
      >
        <ShotPlayer shot={shot} />
        <ShotLayout shot={shot} />
      </div>

      <ShotCommunity shot={shot} />
      <ShotTranscript transcript={shot.transcript} />
    </motion.div>
  );
};
