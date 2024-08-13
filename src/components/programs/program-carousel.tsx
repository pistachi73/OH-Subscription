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
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";
import type { ProgramCardProps } from "./program-card";
import { ProgramCard } from "./program-card";

type ProgramCarouselProps = {
  title: string;
  programs?: RouterOutputs["program"]["getProgramsForCards"];
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

  if (!programs?.length) {
    return null;
  }

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
          {programs?.map((program, index) => {
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
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
