import { cubicBezier } from "framer-motion";

export const cardsEase = cubicBezier(0.23, 1, 0.6, 1);
export const regularEase = cubicBezier(0.4, 0, 0.2, 1);

export const cardAnimationConfig = {
  duration: 0.25,
  delay: 0.4,
  ease: cardsEase,
  shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
};
