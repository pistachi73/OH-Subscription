import { FilterIcon } from "@/components/ui/icons";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

import { ProgramList } from "../program-list";

export const SkeletonFilteredPrograms = () => {
  return (
    <>
      <MaxWidthWrapper
        as="section"
        className="relative z-10 border-y border-border flex flex-col  py-3 overflow-hidden mb-8 mt-6  md:mb-10 md:mt-8"
      >
        <div className="flex flex-row items-center justify-between h-full">
          <div className="flex gap-8 items-center h-full py-2">
            <span className="px-0  font-medium flex items-center gap-2 text-base text-foreground/80 hover:text-foreground transition-colors">
              <FilterIcon className="w-6 h-6" />
              Apply Filters
            </span>
          </div>
        </div>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="relative z-10 grid grid-cols-2  gap-x-2 gap-y-6 sm:gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <ProgramList
          isLoading={true}
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
