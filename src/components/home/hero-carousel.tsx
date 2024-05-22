"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { HeroCard, heroCardHeightProps } from "../ui/cards/hero-card";

import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { useTabFocus } from "@/hooks/use-tab-focus";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";

type HeroCarouselProps = {
  programs: RouterOutputs["program"]["getProgramsForCards"];
};

export const HeroCarousel = ({ programs }: HeroCarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const autoplayIntervalId = useRef<NodeJS.Timeout>();
  const isTabFocused = useTabFocus();

  const autoPlay = () => setCurrent((prev) => (prev + 1) % length);

  const stopInterval = () => {
    if (autoplayIntervalId.current) {
      clearInterval(autoplayIntervalId.current);
      autoplayIntervalId.current = undefined;
    }
  };

  const startInterval = () => {
    if (autoplayIntervalId.current) {
      clearInterval(autoplayIntervalId.current);
    }
    autoplayIntervalId.current = setInterval(autoPlay, 10000);
  };

  useEffect(() => {
    if (!isTabFocused) {
      stopInterval();
    } else {
      startInterval();
    }
  }, [isTabFocused]);

  useEffect(() => {
    return () => {
      stopInterval();
    };
  }, []);

  return (
    <>
      <div
        className={cn("relative z-0 mb-8 sm:mb-12", heroCardHeightProps)}
        onMouseEnter={stopInterval}
        onMouseLeave={startInterval}
      >
        <AnimatePresence initial={false}>
          <HeroCard key={`hero-card-${current}`} program={programs[current]} />
        </AnimatePresence>
      </div>
      <MaxWidthWrapper
        className={cn(
          "relative z-20 mx-0 mb-8 flex w-full items-center justify-center gap-3 sm:mb-12  sm:w-fit sm:justify-normal  sm:gap-2",
        )}
      >
        {Array.from({ length: programs.length }).map((_, index) => (
          <button
            key={`hero-carousel-navigation-${index}`}
            className={cn(
              "h-[6px] w-[6px] rounded-sm bg-primary-800 opacity-15 transition-all sm:h-1 sm:w-3",
              { "opacity-100 sm:w-6": current === index },
            )}
            onClick={() => {
              setCurrent(index);
            }}
            type="button"
            name="hero-carousel-navigation"
          />
        ))}
      </MaxWidthWrapper>
    </>
  );
};
