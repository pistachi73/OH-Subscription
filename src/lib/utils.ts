import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNumber(value: any) {
  return !Number.isNaN(value);
}

export const getImageUrl = (image: string) => {
  return `${env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${image}`;
};
