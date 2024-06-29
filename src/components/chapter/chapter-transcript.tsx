"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { MustBeLoggedIn } from "../ui/comments/must-be-logged-in";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import type { ChapterProps } from "./chapter";
import { useChapterContext } from "./chapter-context";
import { ChapterSideWrapper } from "./chapter-side-wrapper";

export const ChapterTranscript = ({
  chapter,
}: Omit<ChapterProps, "program">) => {
  const user = useCurrentUser();
  const { activeTab, setActiveTab } = useChapterContext();
  const { isMobile } = useDeviceType();

  return (
    <ChapterSideWrapper
      isDialogOpen={activeTab === "transcript"}
      onDialogOpenChange={(open) => {
        if (!open) {
          setActiveTab(null);
        }
      }}
    >
      <div className={cn("flex h-full w-full flex-col", "overflow-hidden")}>
        <div
          className={cn(
            "flex flex-row items-center justify-between px-4 py-3",
            isMobile && "pt-0",
          )}
        >
          <h2 className={cn("text-base font-medium md:text-lg")}>Transcript</h2>
        </div>
        {user ? (
          <ChapterTranscriptContent chapter={chapter} />
        ) : (
          <div className="px-4 flex items-center justify-center h-full pb-4 w-full">
            <MustBeLoggedIn />
          </div>
        )}
      </div>
    </ChapterSideWrapper>
  );
};
const ChapterTranscriptContent = ({
  chapter,
}: Omit<ChapterProps, "program">) => {
  if (!chapter?.transcript) return null;
  return (
    <div className="px-4 py-3 pt-0">
      <p className="text-sm sm:text-base ">{chapter?.transcript}</p>
    </div>
  );
};
