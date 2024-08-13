"use client";

import { cn, getImageUrl } from "@/lib/utils";

import type { ImageProps } from "next/image";
import Image from "next/image";

export type CustomImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
  withPlaceholder?: boolean;
};

export const CustomImage = ({
  fallbackSrc,
  src,
  withPlaceholder = true,
  className,
  ...props
}: CustomImageProps) => {
  if (!src && !fallbackSrc)
    return <div className={cn("bg-muted", className)} />;

  const imageSrc = (src ? getImageUrl(src) : fallbackSrc) as string;

  return (
    <Image
      src={imageSrc}
      className={cn("h-full w-full object-cover", className)}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAABhJREFUKFNjFBbT+s9ABGAcVYgvlKgfPAB9Ig0/Tsb2qQAAAABJRU5ErkJggg=="
      {...props}
    />
  );
};
