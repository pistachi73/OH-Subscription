"use client";

import type {
  ProgramChapter,
  ProgramSpotlight,
} from "@/server/db/schema.types";
import { MediaProvider } from "media-chrome/react/media-store";
import { DeviceOnly } from "../ui/device-only/device-only";
import { ChapterContextProvider } from "./chapter-context";
import { DesktopChapterPlayer } from "./desktop/desktop-chapter-player";
import { MobileChapterCommunity } from "./mobile/mobile-chapter-community";
import { MobileChapterDetails } from "./mobile/mobile-chapter-details";
import { MobileChapterList } from "./mobile/mobile-chapter-list";
import { MobileChapterNavigation } from "./mobile/mobile-chapter-navigation";
import { MobileChapterPlayer } from "./mobile/mobile-chapter-player";
import { ChapterPlayerContainer } from "./player/chapter-player-container";

export type ChapterProps = {
  program: NonNullable<ProgramSpotlight>;
  chapter: NonNullable<ProgramChapter>;
};

export const Chapter = ({ program, chapter }: ChapterProps) => {
  return (
    <ChapterContextProvider chapter={chapter} program={program}>
      <MediaProvider>
        <ChapterContent />
      </MediaProvider>
    </ChapterContextProvider>
  );
};

export const ChapterContent = () => {
  return (
    <>
      <DeviceOnly allowedDevices={["desktop", "tablet"]}>
        <ChapterPlayerContainer>
          <DesktopChapterPlayer />
        </ChapterPlayerContainer>
      </DeviceOnly>

      <DeviceOnly allowedDevices={["mobile"]}>
        <MobileChapterPlayer />
        <MobileChapterNavigation />
        <MobileChapterDetails />
        <MobileChapterList />
        <MobileChapterCommunity />
      </DeviceOnly>
    </>
  );
};
