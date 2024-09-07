import { type LastWatchedChapter, hasLastWatchedChapter } from "@/types";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

export const INCLUDES_FORWARD_SLASH_AT_START_REGEX = /^\/(.|\n)*$/;
export const INCLUDES_FORWARD_SLASH_AT_START = (string: string) =>
  INCLUDES_FORWARD_SLASH_AT_START_REGEX.test(string);

export const getUrl = (path: string) =>
  `${BASE_URL}${!INCLUDES_FORWARD_SLASH_AT_START(path) ? "/" : ""}${path}`;

export const getProgramChapterUrl = ({
  programSlug,
  lastWatchedChapter,
  firstChapterSlug,
}: {
  programSlug: string;
  lastWatchedChapter: LastWatchedChapter | null;
  firstChapterSlug?: string;
}) => {
  const programDetailsHref = `/programs/${programSlug}`;

  return hasLastWatchedChapter(lastWatchedChapter)
    ? `${programDetailsHref}/chapters/${lastWatchedChapter.slug}?start=${Math.floor(lastWatchedChapter.watchedDuration)}`
    : firstChapterSlug
      ? `${programDetailsHref}/chapters/${firstChapterSlug}`
      : programDetailsHref;
};
