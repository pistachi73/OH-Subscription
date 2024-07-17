"use client";

import { ProgramFilter } from "@/components/programs/program-filter";
import { useFilteredPrograms } from "@/components/programs/program-filter/filtered-programs-context";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { ProgramList } from "./program-list";

export const Programs = () => {
  const { filteredPrograms, isFiltering } = useFilteredPrograms();

  return (
    <>
      <MaxWidthWrapper className="relative z-10 mb-6 sm:mb-12 mt-8">
        <ProgramFilter />
      </MaxWidthWrapper>
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
    </>
  );
};
