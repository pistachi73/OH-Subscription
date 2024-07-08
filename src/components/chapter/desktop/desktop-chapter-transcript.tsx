"use client";

import { useChapterContext } from "../chapter-context";
import { ChapterTranscript } from "../chapter-transcript";
import { ChapterSideWrapper } from "./desktop-chapter-side-wrapper";

export const DesktopChapterTranscript = () => {
  const { activeTab, setActiveTab } = useChapterContext();

  return (
    <ChapterSideWrapper
      header="Transcript"
      isDialogOpen={activeTab === "transcript"}
      onDialogOpenChange={(open) => {
        if (!open) {
          setActiveTab(null);
        }
      }}
    >
      <ChapterTranscript />
    </ChapterSideWrapper>
  );
};
