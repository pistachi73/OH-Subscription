import { cardAnimationConfig } from "@/lib/animation";
import { useCallback, useState } from "react";

export const useCardAnimation = () => {
  const [hovered, setHovered] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [animationTimeout, setAnimationTimeout] = useState<NodeJS.Timeout>();

  const onMouseEnter = useCallback(() => {
    if (canHover) {
      const timeout = setTimeout(() => {
        setHovered(true);
        setCanHover(false);
      }, cardAnimationConfig.delay * 1000);
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
