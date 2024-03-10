"use client";

import React from "react";

import Image from "next/image";

import { CarouselHeader } from "./carousel-header";
import { useCarrousel } from "./use-carrousel";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const SeriesCard = ({
  video,
  index,
  lazy,
}: {
  video?: Video;
  index: number;
  lazy: boolean;
}) => {
  return (
    <button className="group/video relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-sm border">
      <span className="absolute left-1 top-1 h-fit shrink-0 rounded bg-primary-800/70 px-1 py-0.5 text-2xs font-medium text-white">
        B1 - B2
      </span>
      <div className="w-full self-end bg-gradient-to-t from-primary-800 to-primary/0 p-2 pt-4">
        <h3 className="myclass text-left text-xs font-medium text-white lg:text-sm">
          English around the world
        </h3>
      </div>
      <Image
        src="/images/video-thumbnail.png"
        alt="video"
        fill
        className="-z-10"
        loading={lazy ? "lazy" : "eager"}
      />
    </button>
  );
};

export const SeriesCarousel = ({
  videos,
  title,
  href,
}: SeriesCarouselProps) => {
  const { slideSizeClassname, slidesToScroll, slidesPerView } = useCarrousel();

  return (
    <div className="my-8 lg:my-[2vw]">
      <CarouselHeader title={title} href={href} />
      <Carousel
        opts={{
          slidesToScroll,
          align: "start",
        }}
      >
        <CarouselContent>
          {Array.from({ length: 11 }).map((_, index) => (
            <CarouselItem key={index} className={slideSizeClassname}>
              <SeriesCard index={index} lazy={index < slidesPerView} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
