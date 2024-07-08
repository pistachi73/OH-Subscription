"use client";

import { ChapterCommunity } from "../chapter-community";
import { useChapterContext } from "../chapter-context";
import { MobileChaterContentDrawer } from "./mobile-chapter-content-drawer";

export const MobileChapterCommunity = () => {
  const { activeTab } = useChapterContext();

  return (
    <MobileChaterContentDrawer
      open={activeTab === "comments"}
      header="Discussion"
      className="p-0"
    >
      <ChapterCommunity />
    </MobileChaterContentDrawer>
  );
};
