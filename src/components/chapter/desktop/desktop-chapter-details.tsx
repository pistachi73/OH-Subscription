"use client";

import { useChapterContext } from "../chapter-context";
import { ChapterDetails } from "../chapter-details";
import { ChapterSideWrapper } from "./desktop-chapter-side-wrapper";

export const DesktopChapterDetails = () => {
  const { activeTab, setActiveTab } = useChapterContext();

  return (
    <ChapterSideWrapper
      header="Details"
      isDialogOpen={activeTab === "details"}
      onDialogOpenChange={(open) => {
        if (!open) {
          setActiveTab(null);
        }
      }}
    >
      <div className="p-4 space-y-9">
        <ChapterDetails />
      </div>
    </ChapterSideWrapper>
  );
};
