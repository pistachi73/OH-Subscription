"use client";

import { motion } from "framer-motion";
import React from "react";

import { Skeleton } from "../skeleton";

import { useCarouselSettings } from "./carousel.hooks";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Video = {
  title: string;
  duration: string;
  level: string;
};

const MotionCarrouselItem = motion(CarouselItem);

export const SeriesCarouselSkeleton = ({}) => {
  const length = 6;
  const { slideSizeClassname, slidesToScroll, slidesPerView } =
    useCarouselSettings();
  return (
    <div className="my-4 lg:my-12">
      <Carousel
        slidesPerView={slidesPerView}
        totalItems={length}
        opts={{
          slidesToScroll,
          align: "start",
          duration: 20,
        }}
      >
        <CarouselContent>
          {Array.from({ length }).map((_, index) => {
            return (
              <MotionCarrouselItem
                key={index}
                className={cn(slideSizeClassname)}
              >
                <Skeleton className=" aspect-video h-full w-full" />
              </MotionCarrouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
