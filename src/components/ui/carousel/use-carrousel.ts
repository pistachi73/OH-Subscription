import { useMemo } from "react";

import { useDeviceType } from "../device-only/device-only-provider";

export const useCarrousel = () => {
  const { deviceSize } = useDeviceType();

  const slidesToScroll = useMemo(
    () => (deviceSize.includes("lg") ? 4 : deviceSize.includes("sm") ? 3 : 2),
    [deviceSize],
  );

  const slidesPerView = useMemo(() => {
    switch (true) {
      case deviceSize.includes("2xl"):
        return 6;
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

  return {
    slidesToScroll,
    slidesPerView,
    slideSizeClassname:
      "basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6",
  };
};
