import type { ChapterSelect } from "../query-utils/programs.query";

export const sortChaptersByLastWatched = (chapters: ChapterSelect) => {
  if (!chapters) return null;

  return [...chapters].sort((a, b) => {
    if (!a.userProgress?.lastWatchedAt) return 1;
    if (!b.userProgress?.lastWatchedAt) return -1;
    return (
      new Date(b.userProgress.lastWatchedAt).getTime() -
      new Date(a.userProgress.lastWatchedAt).getTime()
    );
  });
};

export const sortChaptersByChapterNumber = (chapters: ChapterSelect) => {
  if (!chapters) return null;

  return [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
};
