"use client";
import { useEffect, useMemo, useState } from "react";

import {
  VerticalCarousel,
  type VerticalCarouselApi,
  VerticalCarouselContent,
  VerticalCarouselItem,
  VerticalCarouselNext,
  VerticalCarouselPrevious,
} from "@/components/ui/vertical-carousel";
import { cn } from "@/lib/utils/cn";
import type { ShotCarousel as ShotCarouselType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { api as trpcApi } from "../../trpc/react";
import { DeviceOnly } from "../ui/device-only/device-only";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import { Shot } from "./shot";
import { LoadingShot } from "./shot/loading-shot";

type ShotCarouselProps = {
  initialShot: ShotCarouselType;
  embedding: number[];
  className?: string;
};

export const ShotCarousel = ({ initialShot, className }: ShotCarouselProps) => {
  const [api, setApi] = useState<VerticalCarouselApi>();
  const [current, setCurrent] = useState(0);
  const { deviceType } = useDeviceType();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpcApi.shot.getCarouselShots.useInfiniteQuery(
      {
        initialShotSlug: initialShot.slug,
        initialShotTitle: initialShot.title,
        pageSize: 3,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnMount: false,
      },
    );

  const shots = useMemo(
    () => [initialShot, ...(data?.pages.flatMap((page) => page.shots) ?? [])],
    [data, initialShot],
  );

  useEffect(() => {
    if (!shots?.[current]) return;

    window.history.pushState(null, "", `/shots/${shots?.[current]?.slug}/`);

    if (current === shots.length - 1 && hasNextPage) {
      fetchNextPage();
    }
  }, [current, shots, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
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
          {shots?.map((shot, index) => {
            if (!shot) return null;
            return (
              <VerticalCarouselItem
                key={shot.slug}
                className={cn(
                  "flex h-full w-full basis-full justify-center",
                  deviceType === "mobile"
                    ? "pt-0 sm:pt-0 mt-0 sm:mt-0"
                    : "sm:max-h-[100%] sm:basis-full",
                )}
              >
                <Shot shot={shot} inView={current === index} />
              </VerticalCarouselItem>
            );
          })}

          {isFetchingNextPage && (
            <VerticalCarouselItem
              className={cn(
                "flex h-full w-full basis-full justify-center",
                deviceType === "mobile"
                  ? "pt-0 sm:pt-0 mt-0 sm:mt-0"
                  : "sm:max-h-[100%] sm:basis-full",
              )}
            >
              <LoadingShot />
            </VerticalCarouselItem>
          )}
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
