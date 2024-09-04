import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { currentUser, isUserSubscribed } from "@/lib/auth";
import { getHeaders } from "@/lib/get-headers";
import { api } from "@/trpc/server";

import { ChapterProviders } from "./chapter-providers";

export type ChapterProps = {
  programSlug: string;
  chapterSlug: string;
};

export const Chapter = async ({ programSlug, chapterSlug }: ChapterProps) => {
  const user = await currentUser();

  if (!user) redirect("/");

  const isSubscribed = await isUserSubscribed();

  const program = await api.program.getProgramSpotlight.query({
    slug: programSlug,
  });

  if (!program) {
    redirect("/");
  }

  const chapter = await api.video.getBySlug.query({
    videoSlug: chapterSlug,
    programId: program.id,
  });

  if (!chapter || !(chapter.isFree || isSubscribed)) {
    redirect(`/programs/${program.slug}`);
  }

  const { deviceType } = getHeaders();

  const DynamicChapter = dynamic(() =>
    deviceType === "mobile" ? import("./mobile") : import("./desktop"),
  );

  return (
    <ChapterProviders chapter={chapter} program={program}>
      <DynamicChapter />
    </ChapterProviders>
  );
};
