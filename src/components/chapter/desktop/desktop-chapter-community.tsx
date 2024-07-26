"use client";

import { useCommentsCount } from "@/components/ui/comments/hooks/use-comments-count";
import { ChapterCommunity } from "../chapter-community";
import { useChapterContext } from "../chapter-context";
import { ChapterSideWrapper } from "./desktop-chapter-side-wrapper";

export const DesktopChapterCommunity = () => {
  const { activeTab, setActiveTab, chapter } = useChapterContext();

  const { commentsCount, isLoading } = useCommentsCount({
    videoId: chapter.id,
  });

  return (
    <ChapterSideWrapper
      header={`Discussion ${!isLoading && `(${commentsCount})`}`}
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
