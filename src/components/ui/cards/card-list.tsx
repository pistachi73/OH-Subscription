"use client";

import {
  type DeviceSize,
  useDeviceType,
} from "../device-only/device-only-provider";

import { SeriesCard } from "./series-card";

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
type CardListProps = {
  cardsPerRow: PartialRecord<DeviceSize, number>;
  totalCards?: number;
};

export const CardList = ({ cardsPerRow, totalCards = 20 }: CardListProps) => {
  const { deviceSize } = useDeviceType();

  const isBorder = (
    index: number,
  ): { isLeftBorder: boolean; isRightBorder: boolean } => {
    const reversedDeviceSize = deviceSize.slice().reverse();
    let isLeftBorder = false,
      isRightBorder = false;
    for (const size of reversedDeviceSize) {
      if (cardsPerRow[size]) {
        if (index % cardsPerRow[size]! === 0) {
          isLeftBorder = true;
        }
        if (index % cardsPerRow[size]! === cardsPerRow[size]! - 1) {
          isRightBorder = true;
        }
        break;
      }
    }
    return { isLeftBorder, isRightBorder };
  };

  return (
    <>
      {Array.from({ length: totalCards }).map((_, index) => {
        const { isLeftBorder, isRightBorder } = isBorder(index);
        return (
          <SeriesCard
            key={index}
            lazy={false}
            isLeftBorder={isLeftBorder}
            isRightBorder={isRightBorder}
          />
        );
      })}
    </>
  );
};
