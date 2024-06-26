"use client";

import { AnimatePresence } from "framer-motion";

import { ProgramFilter } from "@/components/programs/program-filter";
import { useFilteredPrograms } from "@/components/programs/program-filter/filtered-programs-context";
import { HeroCard, heroCardHeightProps } from "@/components/ui/cards/hero-card";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { cn } from "@/lib/utils";
import { ProgramList } from "./program-list";

export const Programs = () => {
  const { filteredPrograms, isFiltering } = useFilteredPrograms();

  const [firstProgram, ...restPrograms] = filteredPrograms ?? [];

  return (
    <>
      <div className={cn("relative z-0 mb-12 sm:mb-28", heroCardHeightProps)}>
        <AnimatePresence mode="wait" initial={false}>
          {firstProgram ? (
            <HeroCard
              key={`hero-card-${firstProgram?.id}`}
              program={firstProgram}
            />
          ) : (
            <HeroCard
              key="hero-card-not-found"
              program={{
                title: "No Programs Found",
                description:
                  "Sorry, we couldn't find any programs that match your current filters. Please try adjusting your filters for more results.",
                slug: "",
                thumbnail: null,
              }}
              notFound={true}
            />
          )}
        </AnimatePresence>
      </div>
      <MaxWidthWrapper className="relative z-10 mb-6 sm:mb-12">
        <ProgramFilter />
      </MaxWidthWrapper>
      <MaxWidthWrapper className="relative z-10 grid grid-cols-2  gap-x-2 gap-y-6 sm:gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <ProgramList
          programs={restPrograms}
          isLoading={isFiltering}
          cardsPerRow={{
            xl: 5,
            lg: 4,
            sm: 3,
            xs: 2,
          }}
        />
      </MaxWidthWrapper>
    </>
  );
};
