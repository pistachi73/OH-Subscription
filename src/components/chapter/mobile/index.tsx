"use client";

import dynamic from "next/dynamic";
import { MobileChapterDetails } from "./mobile-chapter-details";
import { MobileChapterNavigation } from "./mobile-chapter-navigation";
import { MobileLoadingChapterPlayer } from "./mobile-loading-chapter-player";

const DynamicMobileChapterPlayer = dynamic(
  () =>
    import("./mobile-chapter-player").then((mod) => mod.MobileChapterPlayer),
  {
    ssr: false,
    loading: () => <MobileLoadingChapterPlayer />,
  },
);

const DynamicMobileChapterList = dynamic(
  () => import("./mobile-chapter-list").then((mod) => mod.MobileChapterList),
  {
    ssr: false,
  },
);

const DynamicMobileChapterCommunity = dynamic(
  () =>
    import("./mobile-chapter-community").then(
      (mod) => mod.MobileChapterCommunity,
    ),
  {
    ssr: false,
  },
);
export const MobileChapter = () => {
  return (
    <>
      <DynamicMobileChapterPlayer />
      <MobileChapterNavigation />
      <MobileChapterDetails />
      <DynamicMobileChapterList />
      <DynamicMobileChapterCommunity />
    </>
  );
};
