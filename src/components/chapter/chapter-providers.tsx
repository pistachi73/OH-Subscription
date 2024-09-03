"use client";

import { MediaProvider } from "media-chrome/react/media-store";

import type { Chapter, ProgramSpotlight } from "@/types";
import { ChapterContextProvider } from "./chapter-context";

export const ChapterProviders = ({
  children,
  chapter,
  program,
}: {
  children: React.ReactNode;
  chapter: NonNullable<Chapter>;
  program: NonNullable<ProgramSpotlight>;
}) => {
  return (
    <MediaProvider>
      <ChapterContextProvider chapter={chapter} program={program}>
        {children}
      </ChapterContextProvider>
    </MediaProvider>
  );
};
