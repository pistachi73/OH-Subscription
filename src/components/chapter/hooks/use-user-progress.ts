"use client";

import type { z } from "zod";

import { api } from "@/trpc/react";
import type { UserProgressInsertSchema } from "@/types";
import {
  useMediaSelector,
  useMediaStore,
} from "media-chrome/react/media-store";
import { useCallback, useEffect, useState } from "react";

type UseUserProgressProps = {
  userId: string;
  programId: number;
  videoId: number;
};

export const useUserProgress = ({
  userId,
  programId,
  videoId,
}: UseUserProgressProps) => {
  const [currentTrackedMediaCurrentTime, setCurrentTrackedMediaCurrentTime] =
    useState(0);
  const { mutate: setProgress } = api.userProgress.setProgress.useMutation();

  const mediaCurrentTimeListener = useMediaSelector(
    (state) => state.mediaCurrentTime,
  );
  const mediaPausedListener = useMediaSelector((state) => state.mediaPaused);
  const mediaEndedListener = useMediaSelector((state) => state.mediaEnded);
  const mediaStore = useMediaStore();

  const setUserProgress = useCallback(
    (
      input: Omit<
        z.infer<typeof UserProgressInsertSchema>,
        "userId" | "programId" | "videoId"
      >,
    ) => setProgress({ userId, programId, videoId, ...input }),
    [setProgress, userId, programId, videoId],
  );

  const setUserTimeProgress = useCallback(() => {
    const mediaDuration = mediaStore.getState().mediaDuration;
    const mediaCurrentTime = mediaStore.getState().mediaCurrentTime;
    const mediaEnded = mediaStore.getState().mediaEnded;

    if (!mediaDuration || !mediaCurrentTime) return;

    const progress = Math.round(
      (mediaCurrentTime / mediaDuration + Number.EPSILON) * 100,
    );

    setUserProgress({
      watchedDuration: mediaCurrentTime,
      progress,
      lastWatchedAt: new Date(),
      completed: mediaEnded,
    });
  }, [setUserProgress, mediaStore]);

  // ------ First load add lastWatchedAt and unmount progress ------
  useEffect(() => {
    setUserProgress({ lastWatchedAt: new Date() });

    return () => {
      setUserTimeProgress();
    };
  }, [setUserProgress, setUserTimeProgress]);

  // ------ Update progress every 30 seconds ------
  useEffect(() => {
    if (!mediaCurrentTimeListener) return;
    const integerMediaCurrentTime = Math.floor(mediaCurrentTimeListener);

    if (integerMediaCurrentTime === 0) return;

    if (
      integerMediaCurrentTime % 30 === 0 &&
      currentTrackedMediaCurrentTime !== integerMediaCurrentTime
    ) {
      setCurrentTrackedMediaCurrentTime(integerMediaCurrentTime);
      setUserTimeProgress();
    }
  }, [
    mediaCurrentTimeListener,
    currentTrackedMediaCurrentTime,
    setUserTimeProgress,
  ]);

  // ------ Udapte onPlay and onPause ------
  useEffect(() => {
    if (mediaPausedListener) return;
    setUserTimeProgress();
  }, [mediaPausedListener, setUserTimeProgress]);

  // ------ Udapte onEnd ------
  useEffect(() => {
    if (!mediaEndedListener) return;
    setUserTimeProgress();
  }, [mediaEndedListener, setUserTimeProgress]);
};
