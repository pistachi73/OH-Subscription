export type LastWatchedChapter = {
  slug?: string;
  chapterNumber?: number;
  watchedDuration?: number;
};

export const hasLastWatchedChapter = (
  lastWatchedChapter: LastWatchedChapter | null,
): lastWatchedChapter is Required<LastWatchedChapter> => {
  return Boolean(
    lastWatchedChapter?.chapterNumber &&
      lastWatchedChapter?.watchedDuration &&
      lastWatchedChapter?.slug,
  );
};
