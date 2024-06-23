"use client";
import { AnimatePresence, motion } from "framer-motion";

import { ShotCommunity } from "./shot-community";
import { ShotTranscript } from "./shot-transcript";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { cn } from "@/lib/utils";
import type { ShotCarouselData } from "@/server/db/schema.types";
import "media-chrome";
import {
  MediaActionTypes,
  MediaProvider,
  useMediaDispatch,
} from "media-chrome/react/media-store";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ShotPlayer } from "../shot-player";
import { ShotContextProvider, useShotContext } from "./shot-context";
import { ShotLayout } from "./shot-layout";

export type ShotProps = {
  shot: NonNullable<ShotCarouselData>;
  inView?: boolean;
};

export const Shot = ({ shot, inView }: ShotProps) => {
  return (
    <ShotContextProvider>
      <MediaProvider>
        <ShotContent shot={shot} inView={inView} />
      </MediaProvider>
    </ShotContextProvider>
  );
};

const ShotContent = ({ shot, inView = false }: ShotProps) => {
  const { showComments, showTranscript } = useShotContext();
  const { deviceSize, isMobile } = useDeviceType();
  const inViewTimeoutRef = useRef<NodeJS.Timeout>();
  const inExitTimeoutRef = useRef<NodeJS.Timeout>();

  const dispatch = useMediaDispatch();

  const isDesktop = deviceSize.includes("xl");
  const canAnimate = showComments || showTranscript;

  useEffect(() => {
    if (inView) {
      if (inExitTimeoutRef.current) {
        clearTimeout(inExitTimeoutRef.current);
      }
      inViewTimeoutRef.current = setTimeout(() => {
        dispatch({
          type: MediaActionTypes.MEDIA_PLAY_REQUEST,
        });
      }, 450);

      return;
    }

    if (inViewTimeoutRef.current) {
      clearTimeout(inViewTimeoutRef.current);
    }

    dispatch({
      type: MediaActionTypes.MEDIA_PAUSE_REQUEST,
    });

    inExitTimeoutRef.current = setTimeout(() => {
      dispatch({
        type: MediaActionTypes.MEDIA_SEEK_REQUEST,
        detail: 0,
      });
    }, 500);

    return () => {
      if (inViewTimeoutRef.current) {
        clearTimeout(inViewTimeoutRef.current);
      }
      if (inExitTimeoutRef) {
        clearTimeout(inExitTimeoutRef.current);
      }
    };
  }, [inView, dispatch]);

  return (
    <motion.div
      // ref={ref}
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
        <AnimatePresence>
          {!inView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                delay: 0.5,
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <Image
                src={`https://image.mux.com/${shot.playbackId}/thumbnail.webp?width=900&height=1600&time=4`}
                alt="shot thumbnail"
                fill
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <ShotLayout shot={shot} />
      </div>
      <ShotCommunity shot={shot} />
      <ShotTranscript transcript={shot.transcript} />
    </motion.div>
  );
};
