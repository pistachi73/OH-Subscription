"use client";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

export const useMobileHeaderHide = () => {
  const { scrollY } = useScroll();

  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;

    if (latest > 10) setIsScrolled(true);
    else setIsScrolled(false);

    if (latest === 0 && prev > 68) {
      //Opening of drawer or modal
      return;
    }

    if (latest > prev && latest > 68) setIsHidden(true);
    else setIsHidden(false);
  });

  return { isHidden, isScrolled };
};
