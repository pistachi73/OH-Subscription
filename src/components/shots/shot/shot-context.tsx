import {
  HeartIcon,
  ShareArrowIcon,
  SpeachBubbleIcon,
  TranscriptIcon,
} from "@/components/ui/icons";
import React, { useState } from "react";

const ShotContext = React.createContext<{
  showComments: boolean;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
  showTranscript: boolean;
  setShowTranscript: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  showComments: false,
  setShowComments: () => {},
  showTranscript: false,
  setShowTranscript: () => {},
});

export const ShotContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [showComments, setShowComments] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const value = React.useMemo(
    () => ({
      showComments,
      setShowComments,
      showTranscript,
      setShowTranscript,
    }),
    [showComments, showTranscript],
  );

  return <ShotContext.Provider value={value}>{children}</ShotContext.Provider>;
};

export const ShotProvider = ({ children }: { children: React.ReactNode }) => {
  return <ShotContextProvider>{children}</ShotContextProvider>;
};

export const useShotContext = () => {
  const context = React.useContext(ShotContext);

  const shotOptionsButtons = [
    {
      icon: TranscriptIcon,
      label: "Transcript",
      onClick: () => {
        context.setShowComments(false);
        context.setShowTranscript((prev) => !prev);
      },
    },

    {
      icon: SpeachBubbleIcon,
      label: "Comment",
      onClick: () => {
        context.setShowTranscript(false);
        context.setShowComments((prev) => !prev);
      },
    },
    { icon: HeartIcon, label: "Like" },
    {
      icon: ShareArrowIcon,
      label: "Share",
    },
  ] as const;

  if (context === undefined) {
    throw new Error("useShotContext must be used within a ShotContextProvider");
  }

  return { ...context, shotOptionsButtons };
};
