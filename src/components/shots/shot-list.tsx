"use client";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { cn } from "@/lib/utils";
import type { ShotCard as ShotCardProps } from "@/server/db/schema.types";
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
    slideSizeClassname: "basis-1/3 sm:basis-1/4 lg:basis-1/6 xl:basis-1/7",
  };
};

type ShotListProps = {
  shots?: ShotCardProps[];
};

export const ShotList = ({ shots }: ShotListProps) => {
  const { slidesPerView, slideSizeClassname } = useShotList();

  if (!shots?.length) return null;

  return (
    <MaxWidthWrapper className={cn("relative z-[2]")} as="section">
      <h2 className="relative mb-1 flex w-fit items-center gap-3">
        <span className="flex items-center gap-2 text-base font-medium tracking-tight lg:text-xl">
          Shots
        </span>
      </h2>
      <div className="flex flex-row gap-4">
        {shots.map((shot, index) => {
          return (
            <div
              key={shot.playbackId}
              className={cn("aspect-[9/16] h-full w-full", slideSizeClassname)}
            >
              <ShotCard shot={shot} />
            </div>
          );
        })}
      </div>
    </MaxWidthWrapper>
  );
};
