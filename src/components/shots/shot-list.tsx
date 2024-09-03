"use client";

import { useMemo } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselHeader } from "@/components/ui/carousel/carousel-header";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { cn } from "@/lib/utils/cn";

import { ShotCard } from "./shot-card";

import type { ShotCard as ShotCardType } from "@/types";

export const useShotList = () => {
  const { deviceSize } = useDeviceType();

  const slidesPerView = useMemo(() => {
    switch (true) {
      case deviceSize.includes("2xl"):
        return 7;
      case deviceSize.includes("xl"):
        return 6;
      case deviceSize.includes("lg"):
        return 5;
      case deviceSize.includes("md"):
        return 4;
      case deviceSize.includes("sm"):
        return 3;
      default:
        return 2;
    }
  }, [deviceSize]);

  return {
    slidesPerView,
    slideSizeClassname:
      "basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7",
  };
};

type ShotListProps = {
  shots?: ShotCardType[];
};

export const ShotList = ({ shots }: ShotListProps) => {
  const { slidesPerView, slideSizeClassname } = useShotList();

  if (!shots?.length) return null;

  return (
    <div className="my-8 md:my-10 lg:my-12">
      <CarouselHeader title={"Shots"} />
      <Carousel
        slidesPerView={slidesPerView}
        totalItems={shots?.length ?? slidesPerView}
        opts={{
          slidesToScroll: slidesPerView,
          align: "start",
          duration: 20,
          inViewThreshold: 0.5,
        }}
      >
        <CarouselContent>
          {shots.map((shot) => {
            return (
              <CarouselItem
                key={shot.playbackId}
                className={cn(slideSizeClassname)}
              >
                <ShotCard shot={shot} />
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
