"use client";

import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

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

  // const autoPlay = () => setCurrent((prev) => (prev + 1) % programs.length);

  // const stopInterval = () => {
  //   if (autoplayIntervalId.current) {
  //     clearInterval(autoplayIntervalId.current);
  //     autoplayIntervalId.current = undefined;
  //   }
  // };

  // const startInterval = () => {
  //   if (autoplayIntervalId.current) {
  //     clearInterval(autoplayIntervalId.current);
  //   }
  //   autoplayIntervalId.current = setInterval(autoPlay, 5000);
  // };

  // useEffect(() => {
  //   if (!isTabFocused) {
  //     stopInterval();
  //   } else {
  //     startInterval();
  //   }
  // }, [isTabFocused, startInterval, stopInterval]);

  // useEffect(() => {
  //   return () => {
  //     stopInterval();
  //   };
  // }, [stopInterval]);

  return (
    <>
      <div
        className={cn("relative z-0 mb-8 sm:mb-12", heroCardHeightProps)}
        // onMouseEnter={stopInterval}
        // onMouseLeave={startInterval}
      >
        <AnimatePresence initial={false}>
          <HeroCard
            key={`hero-card-${current}`}
            program={programs[current]}
            index={current}
          />
        </AnimatePresence>
      </div>
      <MaxWidthWrapper
        className={cn(
          "relative z-20 mx-0 mb-8 flex w-full items-center justify-center sm:mb-12  sm:w-fit sm:justify-normal",
        )}
      >
        {Array.from({ length: programs.length }).map((_, index) => (
          <button
            key={`hero-carousel-navigation-${index}`}
            className="py-1 px-1"
            onClick={() => {
              setCurrent(index);
            }}
            type="button"
            name="hero-carousel-navigation"
          >
            <div
              className={cn(
                "rounded-sm bg-primary opacity-15 dark:opacity-30 transition-all h-1 w-3",
                { "opacity-100 dark:opacity-100 w-6": current === index },
              )}
            />
          </button>
        ))}
      </MaxWidthWrapper>
    </>
  );
};
