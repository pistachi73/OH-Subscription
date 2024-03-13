import { cubicBezier } from "framer-motion";

export const animationConfig = {
  duration: 0.25,
  delay: 0.4,
  //   ease: cubicBezier(0.25, 1, 0.5, 1),
  ease: cubicBezier(0.23, 1, 0.6, 1),

  shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
};
