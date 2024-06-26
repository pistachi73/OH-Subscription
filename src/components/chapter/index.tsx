"use client";

import { cn } from "@/lib/utils";
import type {
  ProgramChapter,
  ProgramSpotlight,
} from "@/server/db/schema.types";
import { MediaProvider } from "media-chrome/react/media-store";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import { ChapterCommunity } from "./chapter-community";
import { ChapterContextProvider, useChapterContext } from "./chapter-context";
import { ChapterList } from "./chapter-list";
import { ChapterPlayer } from "./chapter-player";
import { ChapterPlayerContainer } from "./chapter-player/chapter-player-container";
import { ChapterTranscript } from "./chapter-transcript";

type ChapterProps = {
  program: NonNullable<ProgramSpotlight>;
  chapter: NonNullable<ProgramChapter>;
};

export const Chapter = ({ program, chapter }: ChapterProps) => {
  return (
    <ChapterContextProvider>
      <MediaProvider>
        <ChapterContent program={program} chapter={chapter} />
      </MediaProvider>
    </ChapterContextProvider>
  );
};

export const ChapterContent = ({ program, chapter }: ChapterProps) => {
  const { activeTab } = useChapterContext();

  const { deviceSize } = useDeviceType();

  console.table({ trans: Boolean(chapter.transcript) });

  return (
    <div
      className={cn(
        "h-[100dvh] w-full transition-[grid,height] bg-muted-background ease-in-out duration-300 overflow-hidden ",
        "grid-cols-[1fr,0px] grid",
        activeTab ? "lg:grid-cols-[1fr,450px]" : "lg:grid-cols-[1fr,0px]",
      )}
    >
      <ChapterPlayerContainer>
        <ChapterPlayer chapter={chapter} program={program} />
      </ChapterPlayerContainer>
      <div className="relative w-full h-full">
        <ChapterCommunity chapter={chapter} />
        {chapter.transcript && <ChapterTranscript chapter={chapter} />}
        <ChapterList program={program} />
      </div>
    </div>
  );
};
