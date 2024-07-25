"use client";

import { DeviceOnly } from "@/components/ui/device-only/device-only";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import {
  VerticalCarousel,
  type VerticalCarouselApi,
  VerticalCarouselContent,
  VerticalCarouselNext,
  VerticalCarouselPrevious,
} from "@/components/ui/vertical-carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const CarouselContainer = ({
  children,
  setApi,
}: {
  children: React.ReactNode;
  setApi?: ((api: VerticalCarouselApi) => void) | undefined;
}) => {
  const { deviceType } = useDeviceType();
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
        className={cn("h-full relative")}
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
            "left-[4%] sm:left-[4%] 2xl:left-14 sm:text-foreground -ml-4",
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
          {children}
        </VerticalCarouselContent>
        <DeviceOnly allowedDevices={["tablet", "desktop"]}>
          <div className="z-0 absolute right-[4%] sm:right-[4%] 2xl:right-14 top-0 h-full flex items-end justify-center flex-col gap-3">
            <VerticalCarouselPrevious className="hidden sm:block" />
            <VerticalCarouselNext className="hidden sm:block" />
          </div>
        </DeviceOnly>
      </VerticalCarousel>
    </div>
  );
};
