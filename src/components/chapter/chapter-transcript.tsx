"use client";

import { useChapterContext } from "./chapter-context";

export const ChapterTranscript = () => {
  const { chapter } = useChapterContext();
  if (!chapter?.transcript) return null;
  return (
    <div className="p-4">
      <p className="text-sm sm:text-base ">{chapter?.transcript}</p>
    </div>
  );
};
