"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { ShotCard as ShotCardProps } from "@/server/db/schema.types";
import { useMemo } from "react";
import { CarouselHeader } from "../ui/carousel/carousel-header";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import { ShotCard } from "./shot-card";

export const useShotList = () => {
  const { deviceSize } = useDeviceType();

  const slidesPerView = useMemo(() => {
    switch (true) {
      case deviceSize.includes("xl"):
        return 7;
      case deviceSize.includes("lg"):
        return 6;
      case deviceSize.includes("sm"):
        return 4;
      default:
        return 2;
    }
  }, [deviceSize]);

  return {
    slidesPerView,
    slideSizeClassname: "basis-1/2 sm:basis-1/4 lg:basis-1/6 xl:basis-1/7",
  };
};

type ShotListProps = {
  shots?: ShotCardProps[];
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
