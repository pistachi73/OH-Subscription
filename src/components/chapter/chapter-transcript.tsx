"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { MustBeLoggedIn } from "../ui/comments/must-be-logged-in";
import { useChapterContext } from "./chapter-context";

export const ChapterTranscript = () => {
  const user = useCurrentUser();

  return user ? (
    <ChapterTranscriptContent />
  ) : (
    <div className="px-4 flex items-center justify-center h-full pb-4 w-full">
      <MustBeLoggedIn />
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
