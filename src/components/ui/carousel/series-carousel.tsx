"use client";

import React from "react";

import { SeriesCard, type SeriesCardProps } from "../cards/series-card";

import { CarouselHeader } from "./carousel-header";
import { useCarouselBorders, useCarouselSettings } from "./carousel.hooks";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Video = {
  title: string;
  duration: string;
  level: string;
};

type SeriesCarouselProps = {
  title: string;
  videos?: Video[];
  href?: string;
};

const CarouselSeriesCard = ({
  lazy,
  index,
}: SeriesCardProps & { index: number }) => {
  const { isLeftBorder, isRightBorder } = useCarouselBorders({ index });

  return (
    <SeriesCard
      lazy={lazy}
      isLeftBorder={isLeftBorder}
      isRightBorder={isRightBorder}
    />
  );
};

export const SeriesCarousel = ({
  videos,
  title,
  href,
}: SeriesCarouselProps) => {
  const length = videos?.length || 13;
  const { slideSizeClassname, slidesToScroll, slidesPerView } =
    useCarouselSettings();
  return (
    <div className="my-4 lg:my-12">
      <CarouselHeader title={title} href={href} />
      <Carousel
        slidesPerView={slidesPerView}
        totalItems={length}
        opts={{
          slidesToScroll,
          align: "start",
          duration: 20,
          inViewThreshold: 0.5,
        }}
      >
        <CarouselContent>
          {Array.from({ length }).map((_, index) => {
            return (
              <CarouselItem key={index} className={cn(slideSizeClassname)}>
                <CarouselSeriesCard
                  index={index}
                  lazy={index < slidesPerView}
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
