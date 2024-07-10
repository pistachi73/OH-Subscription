"use client";

import {
  HeartIcon,
  InfoIcon,
  LayersIcon,
  ShareIcon,
  SpeachBubbleIcon,
  TranscriptIcon,
} from "@/components/ui/icons";
import type {
  ProgramChapter,
  ProgramSpotlight,
} from "@/server/db/schema.types";
import { MediaProvider } from "media-chrome/react/media-store";
import React, { useState } from "react";
import { useDeviceType } from "../ui/device-only/device-only-provider";

export type ChapterTab = "details" | "comments" | "transcript" | "chapters";

const ChapterContext = React.createContext<{
  activeTab: ChapterTab | null;
  setActiveTab: React.Dispatch<React.SetStateAction<ChapterTab | null>>;
  autoPlay: boolean;
  setAutoPlay: React.Dispatch<React.SetStateAction<boolean>>;
  chapter: NonNullable<ProgramChapter>;
  program: NonNullable<ProgramSpotlight>;
}>({
  activeTab: null,
  setActiveTab: () => {},
  autoPlay: false,
  setAutoPlay: () => {},
  chapter: {} as any,
  program: {} as any,
});

export const ChapterContextProvider = ({
  children,
  chapter,
  program,
}: {
  children: React.ReactNode;
  chapter: NonNullable<ProgramChapter>;
  program: NonNullable<ProgramSpotlight>;
}) => {
  const { isMobile } = useDeviceType();
  const [activeTab, setActiveTab] = useState<ChapterTab | null>(
    isMobile ? "details" : null,
  );
  const [autoPlay, setAutoPlay] = useState(false);

  const value = React.useMemo(
    () => ({
      activeTab,
      setActiveTab,
      autoPlay,
      setAutoPlay,
      chapter,
      program,
    }),

    [activeTab, autoPlay, chapter, program],
  );

  return (
    <ChapterContext.Provider value={value}>
      <MediaProvider>{children}</MediaProvider>
    </ChapterContext.Provider>
  );
};

export const useChapterContext = () => {
  const context = React.useContext(ChapterContext);

  const mobileButtons = [
    {
      label: "Details",
      isActive: context.activeTab === "details",
      onClick: () => {
        context.setActiveTab((tab) => (tab === "details" ? null : "details"));
      },
    },
    {
      label: "Chapters",
      isActive: context.activeTab === "chapters",
      onClick: () => {
        context.setActiveTab((tab) => (tab === "chapters" ? null : "chapters"));
      },
    },
    {
      label: "Discussion",
      isActive: context.activeTab === "comments",
      onClick: () => {
        context.setActiveTab((tab) => (tab === "comments" ? null : "comments"));
      },
    },
    {
      label: "Transcript",
      isActive: context.activeTab === "transcript",
      onClick: () => {
        context.setActiveTab((tab) =>
          tab === "transcript" ? null : "transcript",
        );
      },
      hidden: context.chapter && !context.chapter.transcript,
    },
  ];

  const bottomButtons = [
    {
      icon: LayersIcon,
      label: "Chapters",
      onClick: () => {
        context.setActiveTab((tab) => (tab === "chapters" ? null : "chapters"));
      },
    },
    {
      icon: InfoIcon,
      label: "Details",
      onClick: () => {
        context.setActiveTab((tab) => (tab === "details" ? null : "details"));
      },
    },
    {
      icon: TranscriptIcon,
      label: "Transcript",
      onClick: () => {
        context.setActiveTab((tab) =>
          tab === "transcript" ? null : "transcript",
        );
      },
      hidden: context.chapter && !context.chapter.transcript,
    },

    {
      icon: SpeachBubbleIcon,
      label: "Comment",
      onClick: () => {
        context.setActiveTab((tab) => (tab === "comments" ? null : "comments"));
      },
    },
    {
      icon: ShareIcon,
      label: "Share",
    },
    { icon: HeartIcon, label: "Add to favorites" },
  ];

  if (context === undefined) {
    throw new Error(
      "useChapterContext must be used within a ChapterContextProvider",
    );
  }

  return { ...context, bottomButtons, mobileButtons };
};
