"use client";

import { cn } from "@/lib/utils/cn";
import { getImageUrl } from "@/lib/utils/get-image-url";

import type { ImageProps } from "next/image";
import Image from "next/image";

export type ImageWithPlaceholderProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

const blurDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAABhJREFUKFNjFBbT+s9ABGAcVYgvlKgfPAB9Ig0/Tsb2qQAAAABJRU5ErkJggg==";

export const ImageWithPlaceholder = ({
  fallbackSrc,
  src,
  className,
  ...props
}: ImageWithPlaceholderProps) => {
  if (!src && !fallbackSrc)
    return <div className={cn("bg-muted", className)} />;

  const imageSrc = (src ? getImageUrl(src) : fallbackSrc) as string;

  return (
    <Image
      src={imageSrc}
      className={cn("h-full w-full object-cover", className)}
      placeholder="blur"
      blurDataURL={blurDataUrl}
      {...props}
    />
  );
};
