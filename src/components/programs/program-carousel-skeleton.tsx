"use client";

import { useCarouselSettings } from "@/components/ui/carousel/carousel.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";

export const ProgramCarouselSkeleton = () => {
  const { slidesPerView } = useCarouselSettings();
  return (
    <MaxWidthWrapper className="my-4 lg:my-12">
      <Skeleton className="w-[300px] h-7 relative mb-1 flex items-center gap-3  " />
      <div className="flex flex-row gap-1 lg:gap-2 xl:gap-3  overflow-visible">
        {Array.from({ length: slidesPerView + 3 }).map((_, index) => {
          return (
            <div
              key={`program-carousel-skeleton-item${index}`}
              className="basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 shrink-0"
            >
              <Skeleton
                className="animate-pulse-carousel aspect-video h-full w-full"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              />
            </div>
          );
        })}
      </div>
    </MaxWidthWrapper>
  );
};
