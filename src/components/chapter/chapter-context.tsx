"use client";

import {
  HeartIcon,
  LayersIcon,
  ShareIcon,
  SpeachBubbleIcon,
  TranscriptIcon,
} from "@/components/ui/icons";
import {
  MediaActionTypes,
  useMediaDispatch,
} from "media-chrome/react/media-store";
import React, { useState } from "react";

export type ChapterTab = "comments" | "transcript" | "chapters";

const ChapterContext = React.createContext<{
  activeTab: ChapterTab | null;
  setActiveTab: React.Dispatch<React.SetStateAction<ChapterTab | null>>;
  autoPlay: boolean;
  setAutoPlay: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  activeTab: null,
  setActiveTab: () => {},
  autoPlay: false,
  setAutoPlay: () => {},
});

export const ChapterContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<ChapterTab | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const value = React.useMemo(
    () => ({
      activeTab,
      setActiveTab,
      autoPlay,
      setAutoPlay,
    }),
    [activeTab, autoPlay],
  );

  return (
    <ChapterContext.Provider value={value}>{children}</ChapterContext.Provider>
  );
};

export const ChapterProvider = ({
  children,
}: { children: React.ReactNode }) => {
  return <ChapterContextProvider>{children}</ChapterContextProvider>;
};

export const useChapterContext = () => {
  const context = React.useContext(ChapterContext);
  const dispatch = useMediaDispatch();

  const bottomButtons = [
    {
      icon: LayersIcon,
      label: "Chapters",
      onClick: () => {
        context.setActiveTab((tab) => (tab === "chapters" ? null : "chapters"));
        dispatch({
          type: MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST,
        });
      },
    },
    {
      icon: TranscriptIcon,
      label: "Transcript",
      onClick: () => {
        context.setActiveTab((tab) =>
          tab === "transcript" ? null : "transcript",
        );
        dispatch({
          type: MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST,
        });
      },
    },

    {
      icon: SpeachBubbleIcon,
      label: "Comment",
      onClick: () => {
        context.setActiveTab((tab) => (tab === "comments" ? null : "comments"));
        dispatch({
          type: MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST,
        });
      },
    },
    {
      icon: ShareIcon,
      label: "Share",
    },
    { icon: HeartIcon, label: "Add to favorites" },
  ] as const;

  if (context === undefined) {
    throw new Error(
      "useChapterContext must be used within a ChapterContextProvider",
    );
  }

  return { ...context, bottomButtons };
};
