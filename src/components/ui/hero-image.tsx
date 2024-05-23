import type React from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

type HeroImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  containerClassname?: string;
  shadowClassname?: string;
};

export const HeroImage = ({
  src,
  alt,
  containerClassname,
  shadowClassname,
}: HeroImageProps) => {
  if (!src || !alt) return null;
  return (
    <div
      className={cn(
        "absolute left-0 top-0 aspect-video max-h-[calc(100vh-100px+var(--header-height))] w-full ",
        containerClassname,
      )}
    >
      <Image
        src={src}
        alt={alt}
        className="w-full object-cover"
        fill
        priority
      />
      <div
        className={cn(
          "absolute -bottom-px left-0 z-0 h-[calc(100%+1px)] w-full bg-gradient-to-t from-muted-background to-50%",
          " before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-hero-gradient sm:to-35% before:content-['']",
          shadowClassname,
        )}
      />
    </div>
  );
};
