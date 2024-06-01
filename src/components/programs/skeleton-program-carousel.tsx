"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCarouselSettings } from "@/components/ui/carousel/carousel.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Video = {
  title: string;
  duration: string;
  level: string;
};

export const SkeletonProgramCarousel = () => {
  const { slideSizeClassname, slidesToScroll, slidesPerView } =
    useCarouselSettings();
  return (
    <div className="my-4 lg:my-12">
      <Carousel
        slidesPerView={slidesPerView}
        totalItems={slidesPerView}
        opts={{
          slidesToScroll,
          align: "start",
          duration: 20,
        }}
      >
        <CarouselContent>
          {Array.from({ length: slidesPerView }).map((_, index) => {
            return (
              <CarouselItem
                key={`program-carousel-skeleton-item${index}`}
                className={cn(slideSizeClassname)}
              >
                <Skeleton className=" aspect-video h-full w-full" />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
