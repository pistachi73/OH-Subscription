import { useMemo } from "react";

import { useCarousel } from "@/components/ui/carousel";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";

export const useTeacherCarousel = () => {
  const { deviceSize } = useDeviceType();

  const slidesPerView = useMemo(() => {
    switch (true) {
      case deviceSize.includes("xl"):
        return 5;
      case deviceSize.includes("md"):
        return 2;
      default:
        return 1;
    }
  }, [deviceSize]);

  return {
    slidesPerView,
    slideSizeClassname: "basis-full md:basis-1/2 xl:basis-1/5",
  };
};

export const useCarouselBorders = ({ index }: { index: number }) => {
  const { current, total, slidesPerView, totalItems } = useCarousel();

  let leftBorder: number;
  let rightBorder: number;

  if (current === total) {
    rightBorder = totalItems - 1;
    leftBorder = total === 1 ? 0 : rightBorder - slidesPerView + 1;
  } else {
    leftBorder = (current - 1) * slidesPerView;
    rightBorder = current * slidesPerView - 1;
  }

  const isLeftBorder = index === leftBorder;
  const isRightBorder = index === rightBorder;

  return { isLeftBorder, isRightBorder };
};
