import type React from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

type HeroImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  containerClassname?: string;
  priority?: boolean;
};

export const HeroImage = ({
  src,
  alt,
  containerClassname,
  priority = false,
}: HeroImageProps) => {
  if (!src || !alt) return null;
  return (
    <div
      className={cn(
        "absolute left-0 top-0 aspect-video w-full",
        "after:absolute after:z-10 after:left-0 after:top-0 after:h-full after:w-full after:bg-hero-gradient-bottom after:content-['']",
        "before:absolute before:z-10 before:left-0 before:top-0 before:h-full before:w-full before:bg-hero-gradient  before:content-['']",
        containerClassname,
      )}
    >
      <Image
        src={src}
        alt={alt}
        className="w-full object-cover"
        fill
        priority={priority}
        sizes="(max-width: 1300px) 100vw, 75vw"
      />
    </div>
  );
};
