"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { HeroCard } from "../cards/hero-card";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { cn } from "@/lib/utils";

export const HeroCarousel = () => {
  const length = 11;
  const [current, setCurrent] = useState<number>(0);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout>();

  const autoPlay = () => setCurrent((prev) => (prev + 1) % length);

  useEffect(() => {
    const interval = setInterval(autoPlay, 5000);
    setAutoPlayInterval(interval);
    return () => clearInterval(autoPlayInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseEnter = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(undefined);
    }
  };

  const onMouseLeave = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
    setAutoPlayInterval(setInterval(autoPlay, 5000));
  };

  return (
    <div
      className="h-full w-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MaxWidthWrapper className="absolute bottom-6 left-0 z-10 flex w-fit items-center gap-1 ">
        {Array.from({ length }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1 w-3 rounded-sm bg-primary-800 opacity-25 transition-all",
              { "w-6 opacity-100": current === index },
            )}
            onClick={() => {
              setCurrent(index);
            }}
            type="button"
          />
        ))}
      </MaxWidthWrapper>
      <AnimatePresence initial={false} mode="popLayout">
        {Array.from({ length }).map(
          (_, index) =>
            current === index && (
              <HeroCard key={"hero-card-" + index} index={index} />
            ),
        )}
      </AnimatePresence>
    </div>
  );
};
