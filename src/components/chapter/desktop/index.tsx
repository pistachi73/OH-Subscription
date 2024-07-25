"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useChapterContext } from "../chapter-context";
import { ChapterPlayerContainer } from "../player/chapter-player-container";
import { DesktopLoadingChapterPlayer } from "./desktop-loading-chapter-player";

const DynamicDesktopChapterPlayer = dynamic(
  () =>
    import("./desktop-chapter-player").then((mod) => mod.DesktopChapterPlayer),
  { ssr: false, loading: () => <DesktopLoadingChapterPlayer /> },
);

const DynamicDesktopChapterCommunity = dynamic(
  () =>
    import("./desktop-chapter-community").then(
      (mod) => mod.DesktopChapterCommunity,
    ),
  { ssr: false },
);

const DynamicDesktopChapterDetails = dynamic(
  () =>
    import("./desktop-chapter-details").then(
      (mod) => mod.DesktopChapterDetails,
    ),
  { ssr: false },
);
const DynamicDesktopChapterList = dynamic(
  () => import("./desktop-chapter-list").then((mod) => mod.DesktopChapterList),
  { ssr: false },
);

const DynamicDesktopChapterTranscript = dynamic(
  () =>
    import("./desktop-chapter-transcript").then(
      (mod) => mod.DesktopChapterTranscript,
    ),
  { ssr: false },
);

const DesktopChapter = () => {
  const { activeTab, chapter } = useChapterContext();
  return (
    <ChapterPlayerContainer>
      <div
        className={cn(
          "w-full transition-[grid] h-[100svh] bg-muted-background ease-in-out duration-300 overflow-hidden",
          "grid-cols-[1fr,0px] grid",
          activeTab
            ? "lg:grid-cols-[1fr,350px]  xl:grid-cols-[1fr,450px] "
            : "lg:grid-cols-[1fr,0px]",
        )}
      >
        <DynamicDesktopChapterPlayer />
        <div className="relative w-full h-full z-0">
          <DynamicDesktopChapterCommunity />
          {chapter.transcript && <DynamicDesktopChapterTranscript />}
          <DynamicDesktopChapterList />
          <DynamicDesktopChapterDetails />
        </div>
      </div>
    </ChapterPlayerContainer>
  );
};

export default DesktopChapter;
