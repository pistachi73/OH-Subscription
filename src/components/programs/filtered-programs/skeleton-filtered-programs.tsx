import { Skeleton } from "@/components/ui/skeleton";
import { MaxWidthWrapper } from "../../ui/max-width-wrapper";
import { ProgramList } from "../program-list";

export const SkeletonFilteredPrograms = () => {
  return (
    <>
      <MaxWidthWrapper className="mb-6 sm:mb-12 mt-4 flex flex-rows gap-4">
        <Skeleton className="basis-full sm:basis-1/4 h-10" />
        <Skeleton className="hidden sm:block basis-1/4 h-10" />
        <Skeleton className="hidden sm:block basis-1/4 h-10" />
        <Skeleton className="hidden sm:block basis-1/4 h-10" />
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
