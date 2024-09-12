"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { cn } from "@/lib/utils/cn";
import { useMemo } from "react";
import { Chapter } from "./program-chapter";
import { RelatedPrograms } from "./program-related";
import { useProgramSpotlightContext } from "./program-spotlight-context";

export const useChapterListCarouselSettings = () => {
  const { deviceSize } = useDeviceType();

  const slidesPerView = useMemo(() => {
    switch (true) {
      case deviceSize.includes("xl"):
        return 4;
      case deviceSize.includes("lg"):
        return 3;
      case deviceSize.includes("sm"):
        return 2;
      default:
        return 1;
    }
  }, [deviceSize]);

  return {
    slidesToScroll: slidesPerView,
    slidesPerView,
    slideSizeClassname: "basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4",
  };
};

export const ProgramChapterList = () => {
  const { data: program } = useProgramSpotlightContext();
  const { slideSizeClassname, slidesToScroll, slidesPerView } =
    useChapterListCarouselSettings();
  if (!program?.chapters?.length) return null;

  const { chapters } = program;

  return (
    <div className="w-full">
      <Carousel
        slidesPerView={slidesPerView}
        totalItems={chapters?.length ?? slidesPerView}
        opts={{
          slidesToScroll,
          align: "start",
          duration: 20,
          inViewThreshold: 0.5,
        }}
      >
        <CarouselContent>
          {program.chapters.map((chapter) => (
            <CarouselItem
              key={`${chapter.slug}`}
              className={cn(slideSizeClassname)}
            >
              <Chapter key={chapter.slug} chapter={chapter} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <RelatedPrograms />
    </div>
  );
};
