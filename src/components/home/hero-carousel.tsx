"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { HeroCard } from "../ui/cards/hero-card";

import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { cn } from "@/lib/utils";

export const HeroCarousel = () => {
  const length = 11;
  const [current, setCurrent] = useState<number>(0);
  const autoplayIntervalId = useRef<NodeJS.Timeout>();

  const autoPlay = useCallback(
    () => setCurrent((prev) => (prev + 1) % length),
    [setCurrent],
  );

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
    autoplayIntervalId.current = setInterval(autoPlay, 50000);
  };

  useEffect(() => {
    startInterval();

    return () => {
      stopInterval();
    };
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startInterval();
      } else {
        stopInterval();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div
      className="relative mb-14 h-[76vw] max-h-[70vh] w-full sm:aspect-video sm:-translate-y-[var(--header-height)]"
      onMouseEnter={stopInterval}
      onMouseLeave={startInterval}
    >
      <MaxWidthWrapper className="absolute -bottom-[22px] left-0 z-20 flex w-full items-center justify-center gap-3 sm:w-fit sm:justify-normal  sm:gap-2">
        {Array.from({ length }).map((_, index) => (
          <button
            key={index}
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
      <AnimatePresence initial={false}>
        <HeroCard key={"hero-card-" + current} index={current} />
      </AnimatePresence>
    </div>
  );
};
