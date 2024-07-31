"use client";

import { useCommentsCount } from "@/components/ui/comments/hooks/use-comments-count";
import { ChapterCommunity } from "../chapter-community";
import { useChapterContext } from "../chapter-context";
import { MobileChaterContentDrawer } from "./mobile-chapter-content-drawer";

export const MobileChapterCommunity = () => {
  const { activeTab, chapter } = useChapterContext();

  const { commentsCount, isLoading } = useCommentsCount({
    videoId: chapter.id,
  });

  return (
    <MobileChaterContentDrawer
      open={activeTab === "comments"}
      header={`Discussion ${!isLoading ? `(${commentsCount})` : ""}`}
      className="p-0"
    >
      <ChapterCommunity />
    </MobileChaterContentDrawer>
  );
};
