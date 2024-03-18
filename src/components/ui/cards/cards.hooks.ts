import { useCallback, useState } from "react";

import { animationConfig } from "./utils";

export const useCardAnimation = () => {
  const [hovered, setHovered] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [animationTimeout, setAnimationTimeout] = useState<NodeJS.Timeout>();

  const onMouseEnter = useCallback(() => {
    if (canHover) {
      const timeout = setTimeout(() => {
        setHovered(true);
        setCanHover(false);
      }, animationConfig.delay * 1000);
      setAnimationTimeout(timeout);
    }
  }, [canHover]);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
    clearTimeout(animationTimeout);
    setAnimationTimeout(undefined);
  }, [animationTimeout]);

  return {
    hovered,
    onMouseEnter,
    onMouseLeave,
    setCanHover,
  };
};
