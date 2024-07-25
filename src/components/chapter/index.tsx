import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { getHeaders } from "@/lib/get-headers";
import { api } from "@/trpc/server";

import { isUserSubscribed } from "@/lib/auth";
import { ChapterContextProvider } from "./chapter-context";

export type ChapterProps = {
  programSlug: string;
  chapterSlug: string;
};

export const Chapter = async ({ programSlug, chapterSlug }: ChapterProps) => {
  const isSubscribed = await isUserSubscribed();

  // TODO: Add blocked chapter component
  // if (!isSubscribed) {
  //   const DynamicBlockedChapter = dynamic(() =>
  //     deviceType === "mobile" ? import("./mobile") : import("./desktop"),
  //   );
  //   redirect("/plans");
  // }

  const program = await api.program.getBySlug.query({
    slug: programSlug,
  });

  if (!program) {
    redirect("/");
  }

  const chapter = await api.video.getBySlug.query({
    videoSlug: chapterSlug,
    programId: program.id,
  });

  if (!chapter) {
    redirect("/");
  }

  const { deviceType } = getHeaders();

  const DynamicChapter = dynamic(() =>
    deviceType === "mobile" ? import("./mobile") : import("./desktop"),
  );

  return (
    <ChapterContextProvider chapter={chapter} program={program}>
      <DynamicChapter />
    </ChapterContextProvider>
  );
};
