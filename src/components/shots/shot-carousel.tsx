"use client";
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
import type { ShotCarouselData } from "@/server/db/schema.types";
import Image from "next/image";
import Link from "next/link";
import { DeviceOnly } from "../ui/device-only/device-only";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import { Shot } from "./shot/index";

type ShotCarouselProps = {
  initialShots: ShotCarouselData[];
  className?: string;
};

export const ShotCarousel = ({
  initialShots,
  className,
}: ShotCarouselProps) => {
  const [api, setApi] = useState<VerticalCarouselApi>();
  const { deviceType } = useDeviceType();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      const selected = api.selectedScrollSnap();
      if (!initialShots?.[selected]) return;
      window.history.pushState(null, "", `/shots/${initialShots?.[selected]}/`);
    });
  }, [api]);

  return (
    <div
      className={cn(
        "relative",
        deviceType === "mobile"
          ? "h-[calc(100dvh)]"
          : "h-[calc(100dvh)] sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] sm:pt-2",
      )}
    >
      <VerticalCarousel
        className={cn("h-full relative", className)}
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

        <VerticalCarouselContent
          className={cn("h-full", deviceType === "mobile" && "sm:mt-0")}
        >
          {initialShots?.map((shot, index) => {
            if (!shot) return null;
            return (
              <VerticalCarouselItem
                key={index}
                className={cn(
                  "flex h-full w-full basis-full justify-center",
                  deviceType === "mobile"
                    ? "pt-0 sm:pt-0 mt-0 sm:mt-0"
                    : "sm:max-h-[97%] sm:basis-[97%]",
                )}
              >
                <Shot shot={shot} />
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
