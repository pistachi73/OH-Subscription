"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselHeader } from "@/components/ui/carousel/carousel-header";
import {
  useCarouselBorders,
  useCarouselSettings,
} from "@/components/ui/carousel/carousel.hooks";
import { cn } from "@/lib/utils/cn";
import type { ProgramCard as ProgramCardType } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { ProgramCard, type ProgramCardProps } from "./program-card";

type ProgramCarouselProps = {
  title: string;
  programs?: ProgramCardType[];
  href?: string;
  priority?: boolean;
};

const CarouselProgramCard = ({
  index,
  program,
  priority,
}: ProgramCardProps & { index: number }) => {
  const { isLeftBorder, isRightBorder } = useCarouselBorders({ index });

  return (
    <ProgramCard
      isLeftBorder={isLeftBorder}
      isRightBorder={isRightBorder}
      program={program}
      index={index}
      priority={priority}
    />
  );
};

export const ProgramCarousel = ({
  programs,
  title,
  href,
  priority = false,
}: ProgramCarouselProps) => {
  const { slideSizeClassname, slidesToScroll, slidesPerView } =
    useCarouselSettings();

  return (
    <div className="my-8 md:my-10 lg:my-12">
      <CarouselHeader title={title} href={href} />
      <Carousel
        slidesPerView={slidesPerView}
        totalItems={programs?.length ?? slidesPerView}
        opts={{
          slidesToScroll,
          align: "start",
          duration: 20,
          inViewThreshold: 0.5,
        }}
      >
        <CarouselContent>
          {programs?.length
            ? programs?.map((program, index) => {
                return (
                  <CarouselItem
                    key={`${title}-${program.slug}`}
                    className={cn(slideSizeClassname)}
                  >
                    <CarouselProgramCard
                      index={index}
                      priority={priority && index < slidesPerView}
                      program={program}
                    />
                  </CarouselItem>
                );
              })
            : Array.from({ length: slidesPerView + 3 }).map((_, index) => {
                return (
                  <CarouselItem
                    key={`program-carousel-skeleton-item${index}`}
                    className={cn(slideSizeClassname)}
                  >
                    <Skeleton
                      className="animate-pulse-carousel aspect-video h-full w-full"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </CarouselItem>
                );
              })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
