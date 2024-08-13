"use client";

import type { DeviceSize } from "@/components/ui/device-only/device-only-provider";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { regularEase } from "@/lib/animation";
import type { RouterOutputs } from "@/trpc/shared";
import { m } from "framer-motion";
import { useCallback, useMemo } from "react";
import { ProgramCard } from "./program-card";

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
type CardListProps = {
  cardsPerRow: PartialRecord<DeviceSize, number>;
  programs?: RouterOutputs["program"]["getProgramsForCards"];
  isLoading?: boolean;
  initialAnimation?: boolean;
  loadingRows?: number;
};

export const ProgramList = ({
  programs,
  cardsPerRow,
  isLoading = false,
  initialAnimation = true,
  loadingRows = 2,
}: CardListProps) => {
  const { deviceSize } = useDeviceType();

  const randomDelayArray = useMemo(() => {
    if (!programs?.length) return;
    const possibleIndexes = Array.from({ length: programs.length }).map(
      (_, index) => index,
    );

    const random = [];

    for (let i = 0; i < programs.length ?? 0; i++) {
      const randomIndex = Math.floor(Math.random() * possibleIndexes.length);
      random.push(possibleIndexes.splice(randomIndex, 1)[0]);
    }

    return random;
  }, [programs]);

  const isBorder = useCallback(
    (index: number): { isLeftBorder: boolean; isRightBorder: boolean } => {
      const reversedDeviceSize = deviceSize.slice().reverse();
      let isLeftBorder = false;
      let isRightBorder = false;
      for (const size of reversedDeviceSize) {
        const cardsInRow = cardsPerRow[size] as number;
        if (cardsPerRow[size]) {
          if (index % cardsInRow === 0) {
            isLeftBorder = true;
          }
          if (index % cardsInRow === cardsInRow - 1) {
            isRightBorder = true;
          }
          break;
        }
      }
      return { isLeftBorder, isRightBorder };
    },
    [deviceSize, cardsPerRow],
  );

  const getLoadingCardsNumber = useCallback(() => {
    const reversedDeviceSize = deviceSize.slice().reverse();
    for (const size of reversedDeviceSize) {
      if (cardsPerRow[size]) {
        return cardsPerRow[size] as number;
      }
    }
    return 6;
  }, [cardsPerRow, deviceSize]);

  if (isLoading) {
    return Array.from({ length: getLoadingCardsNumber() * loadingRows }).map(
      (_, index) => (
        <Skeleton
          key={`program-skeleton-${index}`}
          className="aspect-video animate-pulse-carousel"
          style={{
            animationDelay: `${100 * index}ms`,
          }}
        />
      ),
    );
  }

  if (!programs?.length) {
    return null;
  }

  return (
    <>
      {programs.map((program, index) => {
        const { isLeftBorder, isRightBorder } = isBorder(index);

        return (
          <m.div
            key={`program-${program.id}`}
            initial={initialAnimation ? "initial" : false}
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
            }}
            transition={{
              ease: regularEase,
              duration: 0.5,
              delay: 0.03 * (randomDelayArray?.[index] as number),
            }}
          >
            <ProgramCard
              isLeftBorder={isLeftBorder}
              isRightBorder={isRightBorder}
              program={program}
            />
          </m.div>
        );
      })}
    </>
  );
};
