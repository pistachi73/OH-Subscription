"use client";

import React from "react";

import { ProgramCard, type ProgramCardProps } from "../cards/program-card";

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
import { type RouterOutputs } from "@/trpc/shared";

type Video = {
  title: string;
  duration: string;
  level: string;
};

type ProgramCarouselProps = {
  title: string;
  programs?: RouterOutputs["program"]["getProgramsForCards"];
  href?: string;
};

const CarouselProgramCard = ({
  lazy,
  index,
  program,
}: ProgramCardProps & { index: number }) => {
  const { isLeftBorder, isRightBorder } = useCarouselBorders({ index });

  return (
    <ProgramCard
      lazy={lazy}
      isLeftBorder={isLeftBorder}
      isRightBorder={isRightBorder}
      program={program}
    />
  );
};

export const ProgramCarousel = ({
  programs,
  title,
  href,
}: ProgramCarouselProps) => {
  console.log("ProgramCarousel", programs);
  const { slideSizeClassname, slidesToScroll, slidesPerView } =
    useCarouselSettings();

  if (!programs?.length) return null;

  return (
    <div className="my-4 lg:my-12">
      <CarouselHeader title={title} href={href} />
      <Carousel
        slidesPerView={slidesPerView}
        totalItems={programs.length}
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
              <CarouselItem key={index} className={cn(slideSizeClassname)}>
                <CarouselProgramCard
                  index={index}
                  lazy={index < slidesPerView}
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
