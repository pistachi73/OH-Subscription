"use client";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
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
        return 3;
    }
  }, [deviceSize]);

  return {
    slidesPerView,
    slideSizeClassname: "basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5",
  };
};

export const ShotList = () => {
  const { slidesPerView, slideSizeClassname } = useShotList();
  return (
    <MaxWidthWrapper
      className={cn("flex flex-row gap-4 relative z-[2]")}
      as="section"
    >
      {Array.from({ length: slidesPerView }).map((_, index) => {
        return (
          <div
            key={index}
            className={cn("aspect-[9/16] h-full w-full", slideSizeClassname)}
          >
            <ShotCard />
          </div>
        );
      })}
    </MaxWidthWrapper>
  );
};
