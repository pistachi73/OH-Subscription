"use client";

import dynamic from "next/dynamic";

import { useChapterContext } from "../chapter-context";
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

const DynamicMobileChapterTranscript = dynamic(
  () =>
    import("./mobile-chapter-transcript").then(
      (mod) => mod.MobileChapterTranscript,
    ),
  {
    ssr: false,
  },
);
const MobileChapter = () => {
  const { chapter, activeTab } = useChapterContext();

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 sm:relative">
        <DynamicMobileChapterPlayer />
        <MobileChapterNavigation />
      </div>
      <div className="relative w-full pt-[calc(56.25%+48px)] sm:pt-0">
        <MobileChapterDetails />
        <DynamicMobileChapterList />
        <DynamicMobileChapterCommunity />
        {activeTab}
        {chapter.transcript && <DynamicMobileChapterTranscript />}
      </div>
    </>
  );
};

export default MobileChapter;
