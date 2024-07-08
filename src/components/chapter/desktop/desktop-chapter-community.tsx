"use client";

import { ChapterCommunity } from "../chapter-community";
import { useChapterContext } from "../chapter-context";
import { ChapterSideWrapper } from "./desktop-chapter-side-wrapper";

export const DesktopChapterCommunity = () => {
  const { activeTab, setActiveTab } = useChapterContext();

  return (
    <ChapterSideWrapper
      header="Discussion"
      isDialogOpen={activeTab === "comments"}
      onDialogOpenChange={(open) => {
        if (!open) {
          setActiveTab(null);
        }
      }}
    >
      <ChapterCommunity />
    </ChapterSideWrapper>
  );
};
