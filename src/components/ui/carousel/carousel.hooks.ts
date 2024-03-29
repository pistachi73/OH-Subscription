import { useMemo } from "react";

import { useCarousel } from "../carousel";
import { useDeviceType } from "../device-only/device-only-provider";

export const useCarouselSettings = () => {
  const { deviceSize } = useDeviceType();

  const slidesPerView = useMemo(() => {
    switch (true) {
      case deviceSize.includes("xl"):
        return 5;
      case deviceSize.includes("lg"):
        return 4;
      case deviceSize.includes("sm"):
        return 3;
      default:
        return 2;
    }
  }, [deviceSize]);

  // const slidesToScroll = useMemo(
  //   () => (deviceSize.includes("lg") ? 4 : deviceSize.includes("sm") ? 3 : 2),
  //   [deviceSize],
  // );

  return {
    slidesToScroll: slidesPerView,
    slidesPerView,
    slideSizeClassname: "basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5",
  };
};

export const useCarouselBorders = ({ index }: { index: number }) => {
  const { current, total, slidesPerView, totalItems } = useCarousel();

  let leftBorder, rightBorder;

  if (current === total) {
    rightBorder = totalItems - 1;
    leftBorder = rightBorder - slidesPerView! + 1;
  } else {
    leftBorder = (current! - 1) * slidesPerView!;
    rightBorder = current! * slidesPerView! - 1;
  }

  const isLeftBorder = index === leftBorder;
  const isRightBorder = index === rightBorder;

  return { isLeftBorder, isRightBorder };
};
