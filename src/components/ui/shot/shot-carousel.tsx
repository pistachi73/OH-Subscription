"use client";
import { Button } from "@/components/ui/button";
import { Shot } from "@/components/ui/shot/shot";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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

type ShotCarouselProps = {
  currentShot?: number;
  initialShots?: string[];
  className?: string;
};

export const ShotCarousel = ({ className }: ShotCarouselProps) => {
  const [api, setApi] = useState<VerticalCarouselApi>();
  const [current, setCurrent] = useState(0);

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

  return (
    <div
      className={cn(
        "relative",
        "sm:h-[calc(100vh-var(--header-height))] sm:pt-4",
        "h-[calc(100dvh)]",
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
        <Button
          className={cn(
            "absolute top-0 z-50 h-14 min-w-14 rounded-full p-4 text-background transition-all",
            "sm:left-6 sm:text-foreground",
          )}
          size="inline"
          variant="ghost"
          asChild
        >
          <Link href="/">
            <ArrowLeft size={24} className="sm:mr-2" />
            <span className="hidden text-sm sm:inline">Go back</span>
          </Link>
        </Button>

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
        <VerticalCarouselNext className="hidden sm:block" />
        <VerticalCarouselPrevious className="hidden sm:block" />
      </VerticalCarousel>
    </div>
  );
};
