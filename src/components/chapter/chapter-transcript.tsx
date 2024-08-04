"use client";

import { useIsSubscribed } from "@/hooks/use-is-subscribed";
import { MustBeSubscribed } from "../ui/comments/must-be-subscribed";
import { useChapterContext } from "./chapter-context";

export const ChapterTranscript = () => {
  const isSubscribed = useIsSubscribed();

  return isSubscribed ? (
    <ChapterTranscriptContent />
  ) : (
    <div className="px-4 flex items-center justify-center h-full pb-4 w-full">
      <MustBeSubscribed />
    </div>
  );
};
const ChapterTranscriptContent = () => {
  const { chapter } = useChapterContext();
  if (!chapter?.transcript) return null;
  return (
    <div className="px-4 py-3 pt-0">
      <p className="text-sm sm:text-base ">{chapter?.transcript}</p>
    </div>
  );
};
