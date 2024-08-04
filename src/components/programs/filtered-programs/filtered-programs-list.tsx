"use client";

import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

import { ProgramList } from "../program-list";
import { useFilteredPrograms } from "./filtered-programs-context";

export const FilteredProgramsList = () => {
  const { filteredPrograms, isFiltering } = useFilteredPrograms();

  if (!filteredPrograms?.length && !isFiltering)
    return (
      <MaxWidthWrapper className="mt-6 md:mt-12">
        <h2 className="text-left text-2x text-muted-foreground">
          No programs found
        </h2>
      </MaxWidthWrapper>
    );

  return (
    <MaxWidthWrapper className="relative z-10 grid grid-cols-2  gap-x-2 gap-y-6 sm:gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <ProgramList
        programs={filteredPrograms}
        isLoading={isFiltering}
        loadingRows={4}
        cardsPerRow={{
          xl: 5,
          lg: 4,
          sm: 3,
          xs: 2,
        }}
      />
    </MaxWidthWrapper>
  );
};
