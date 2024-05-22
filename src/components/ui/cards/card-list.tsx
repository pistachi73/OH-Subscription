"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";

import {
  useDeviceType,
  type DeviceSize,
} from "../device-only/device-only-provider";
import { Skeleton } from "../skeleton";

import { ProgramCard } from "./program-card";

import { regularEase } from "@/lib/animation";
import type { RouterOutputs } from "@/trpc/shared";

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
type CardListProps = {
  cardsPerRow: PartialRecord<DeviceSize, number>;
  programs?: RouterOutputs["program"]["getProgramsForCards"];
  isLoading?: boolean;
};

export const CardList = ({
  programs,
  cardsPerRow,
  isLoading = false,
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
    return Array.from({ length: getLoadingCardsNumber() }).map((_, index) => (
      <Skeleton key={index} className="aspect-video" />
    ));
  }

  if (!programs?.length) {
    return null;
  }

  return (
    <>
      {programs.map((program, index) => {
        const { isLeftBorder, isRightBorder } = isBorder(index);

        return (
          <motion.div
            key={index}
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
            }}
            transition={{
              ease: regularEase,
              duration: 0.2,
              delay: 0.05 * (randomDelayArray?.[index] as number),
            }}
          >
            <ProgramCard
              lazy={false}
              isLeftBorder={isLeftBorder}
              isRightBorder={isRightBorder}
              program={program}
            />
          </motion.div>
        );
      })}
    </>
  );
};
