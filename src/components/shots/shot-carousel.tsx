"use client";
import { Shot } from "@/components/shots/shot";
import { useEffect, useState } from "react";

import {
  VerticalCarousel,
  VerticalCarouselContent,
  VerticalCarouselItem,
  VerticalCarouselNext,
  VerticalCarouselPrevious,
  type VerticalCarouselApi,
} from "@/components/ui/vertical-carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { DeviceOnly } from "../ui/device-only/device-only";
import { useDeviceType } from "../ui/device-only/device-only-provider";

type ShotCarouselProps = {
  currentShot?: number;
  initialShots?: string[];
  className?: string;
};

export const ShotCarousel = ({ className }: ShotCarouselProps) => {
  const [api, setApi] = useState<VerticalCarouselApi>();
  const [current, setCurrent] = useState(0);
  const { serverDeviceType } = useDeviceType();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      const selected = api.selectedScrollSnap();
      setCurrent(selected);
      window.history.pushState(null, "", `/shots/${selected}/`);
    });
  }, [api]);

  console.log({ serverDeviceType });

  return (
    <div
      className={cn(
        "relative",
        serverDeviceType === "mobile"
          ? "h-[calc(100dvh)] sm:min-h-[550px]"
          : "h-[calc(100dvh)] sm:min-h-[550px] sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] sm:pt-2",
      )}
    >
      <VerticalCarousel
        className={cn("h-full", className)}
        orientation="vertical"
        opts={{
          align: "start",
          startIndex: 0,
          slidesToScroll: 1,
        }}
        setApi={setApi}
      >
        <Link
          href="/"
          className={cn(
            "absolute sm:hidden top-0 z-50 rounded-full px-4 py-2",
            "left-[2%] sm:left-[4%] 2xl:left-14 sm:text-foreground -ml-4",
          )}
        >
          <Image
            src={"/images/oh-logo.png"}
            alt="logo"
            width={50}
            height={50}
          />
        </Link>

        <VerticalCarouselContent className="h-full">
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              <VerticalCarouselItem
                key={index}
                className={cn(
                  "flex h-full w-full basis-full justify-center",
                  "sm:max-h-[97%] sm:basis-[97%]",
                )}
              >
                <Shot />
              </VerticalCarouselItem>
            );
          })}
        </VerticalCarouselContent>
        <DeviceOnly allowedDevices={["tablet", "desktop"]}>
          <div className="z-0 absolute right-[2%] sm:right-[4%] 2xl:right-14 top-0 h-full flex items-end justify-center flex-col gap-3">
            <VerticalCarouselPrevious className="hidden sm:block" />
            <VerticalCarouselNext className="hidden sm:block" />
          </div>
        </DeviceOnly>
      </VerticalCarousel>
    </div>
  );
};
