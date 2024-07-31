"use client";

import {
  InfoIcon,
  LayersIcon,
  ShareIcon,
  SpeachBubbleIcon,
  TranscriptIcon,
} from "@/components/ui/icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import type {
  ProgramChapter,
  ProgramSpotlight,
} from "@/server/db/schema.types";
import React, { useState } from "react";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import { useLikeChapter } from "./hooks/use-like-chapter";
import { useUserProgress } from "./hooks/use-user-progress";

export type ChapterTab = "details" | "comments" | "transcript" | "chapters";

const ChapterContext = React.createContext<{
  activeTab: ChapterTab | null;
  setActiveTab: React.Dispatch<React.SetStateAction<ChapterTab | null>>;
  autoPlay: boolean;
  setAutoPlay: React.Dispatch<React.SetStateAction<boolean>>;
  isLikedByUser: boolean;
  isLikeLoading: boolean;
  likeChapter: ReturnType<typeof useLikeChapter>["likeChapter"];
  chapter: NonNullable<ProgramChapter>;
  program: NonNullable<ProgramSpotlight>;
}>({
  activeTab: null,
  setActiveTab: () => {},
  autoPlay: false,
  setAutoPlay: () => {},
  isLikedByUser: false,
  isLikeLoading: false,
  likeChapter: () => {},
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
  const user = useCurrentUser();
  const { isMobile } = useDeviceType();
  const [autoPlay, setAutoPlay] = useState(false);

  const [activeTab, setActiveTab] = useState<ChapterTab | null>(
    isMobile ? "details" : null,
  );

  const { isLikedByUser, isLikeLoading, likeChapter } = useLikeChapter({
    initialLiked: chapter.isLikedByUser,
  });

  useUserProgress({
    userId: user?.id as string,
    programId: program.id,
    videoId: chapter.id,
  });

  const value = React.useMemo(
    () => ({
      activeTab,
      setActiveTab,
      autoPlay,
      setAutoPlay,
      isLikedByUser: isLikedByUser ?? false,
      isLikeLoading,
      likeChapter,
      chapter,
      program,
    }),

    [
      activeTab,
      autoPlay,
      chapter,
      program,
      isLikedByUser,
      isLikeLoading,
      likeChapter,
    ],
  );

  return (
    <ChapterContext.Provider value={value}>{children}</ChapterContext.Provider>
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
  ];

  if (context === undefined) {
    throw new Error(
      "useChapterContext must be used within a ChapterContextProvider",
    );
  }

  return { ...context, bottomButtons, mobileButtons };
};
