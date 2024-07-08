"use client";

import { api } from "@/trpc/react";
import { useMediaQuery } from "usehooks-ts";
import { ProgramList } from "../../programs/program-list";
import { MaxWidthWrapper } from "../../ui/max-width-wrapper";
import { useChapterContext } from "../chapter-context";
import { ChapterDetails } from "../chapter-details";

export const MobileChapterDetails = () => {
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const { activeTab, program } = useChapterContext();

  const { data, isLoading } = api.program.getProgramsForCards.useQuery(
    {
      searchQuery: program.title,
      limit: 4,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const relatedPrograms = data?.filter((p) => p.slug !== program.slug);

  const showDetails = !isLandscape || (isLandscape && activeTab === "details");

  if (!showDetails) return null;

  return (
    <MaxWidthWrapper className="mt-6 space-y-9 h-full">
      <ChapterDetails />
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Related programs
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <ProgramList
            programs={relatedPrograms}
            isLoading={isLoading}
            initialAnimation={false}
            cardsPerRow={{
              xs: 2,
              sm: 3,
            }}
          />
        </div>
      </section>
    </MaxWidthWrapper>
  );
};
