"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { HeroCard, heroCardHeightProps } from "../ui/cards/hero-card";

import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";
import { buttonVariants } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/icons";

type HeroCarouselProps = {
  programs: RouterOutputs["program"]["getProgramsForCards"];
};

export const HeroCarousel = ({ programs }: HeroCarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const autoSlideInterval = useRef<NodeJS.Timeout>();

  const onNavigate = useCallback(
    (direction: "next" | "prev") => {
      if (direction === "prev") {
        setCurrent(
          (current) => (current - 1 + programs.length) % programs.length,
        );
      } else {
        setCurrent((current) => (current + 1) % programs.length);
      }

      autoSlide();
    },
    [programs.length],
  );

  const autoSlide = useCallback(() => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }

    autoSlideInterval.current = setInterval(() => {
      onNavigate("next");
    }, 100000000);
  }, [onNavigate]);

  useEffect(() => {
    autoSlide();

    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    };
  }, [autoSlide]);

  return (
    <div className={cn("relative z-0 sm:mb-12", heroCardHeightProps)}>
      {programs.map((program, index) => (
        <HeroCard
          key={`hero-card-${program.slug}`}
          program={program}
          index={index}
          active={current === index}
        />
      ))}
      <div
        className={cn(
          "absolute z-20 right-[4%] 2xl:right-14 top-14 md:top-1/2 md:-translate-y-1/2 flex flex-row items-center justify-center gap-1",
        )}
      >
        <button
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 md:h-12 md:w-12 p-0",
            "bg-background/80 hover:bg-background border-none",
          )}
          onClick={() => {
            onNavigate("prev");
          }}
          type="button"
          aria-label="Navigate to next program"
        >
          <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 md:h-12 md:w-12 p-0",
            "bg-background/80 hover:bg-background border-none",
          )}
          onClick={() => {
            onNavigate("next");
          }}
          type="button"
          aria-label="Navigate to next program"
        >
          <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};
