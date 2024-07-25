"use client";

import { BlockedShot } from "../shot/blocked-shot";
import { CarouselContainer } from "./carousel-container";
import { CarouselItem } from "./carousel-item";

export const BlockedShotCarousel = () => {
  return (
    <CarouselContainer>
      <CarouselItem>
        <BlockedShot />
      </CarouselItem>
    </CarouselContainer>
  );
};
