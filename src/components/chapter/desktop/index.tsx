"use client";

import { m } from "framer-motion";
import dynamic from "next/dynamic";

import { springTransition } from "@/lib/animation";
import { cn } from "@/lib/utils/cn";

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
      <m.div
        className={cn(
          "w-full h-[100svh] bg-muted-background  overflow-hidden grid ",
          "[--cols:1fr_400px] xl:[--cols:1fr_450px]",
        )}
        initial="close"
        animate={activeTab ? "open" : "close"}
        variants={{
          open: {
            gridTemplateColumns: "var(--cols)",
          },
          close: {
            gridTemplateColumns: "1fr 0px",
          },
        }}
        transition={springTransition}
      >
        <DynamicDesktopChapterPlayer />
        <div className="relative w-full h-full z-0">
          <DynamicDesktopChapterCommunity />
          {chapter.transcript && <DynamicDesktopChapterTranscript />}
          <DynamicDesktopChapterList />
          <DynamicDesktopChapterDetails />
        </div>
      </m.div>
    </ChapterPlayerContainer>
  );
};

export default DesktopChapter;
