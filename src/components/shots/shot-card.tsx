"use client";
import { cn } from "@/lib/utils";
import type { ShotCard as ShotCardProps } from "@/server/db/schema.types";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export const ShotCard = ({ shot }: { shot: ShotCardProps }) => {
  const [showPreview, setShowPreview] = useState(false);
  const previewTimeoutRef = useRef<NodeJS.Timeout>();

  const thumbnailUrl = `https://image.mux.com/${shot.playbackId}/thumbnail.webp?width=900&height=1600&time=4`;
  const shotPreviewUrl = `https://image.mux.com/${shot.playbackId}/animated.webp?width=320`;
  return (
    <Link
      href={`/shots/${shot.slug}`}
      className="w-full aspect-[9/16] bg-muted rounded-md relative overflow-hidden flex items-end "
      onMouseEnter={() => {
        if (previewTimeoutRef.current) {
          clearTimeout(previewTimeoutRef.current);
        }
        previewTimeoutRef.current = setTimeout(() => setShowPreview(true), 400);
      }}
      onMouseLeave={() => {
        setShowPreview(false);
        if (previewTimeoutRef.current) {
          clearTimeout(previewTimeoutRef.current);
        }
      }}
    >
      <div
        className={cn(
          "absolute bottom-0 left-0 *:w-full px-2 py-3 w-full  z-30",
          "before:absolute before:-z-10 before:left-0 before:bottom-0 before:h-[150%] before:w-full before:bg-gradient-to-t from-black/70 from-25% to-black/0 before:content-['']",
        )}
      >
        <span className="line-clamp-2 text-sm font-medium text-white">
          {shot.title}
        </span>
      </div>

      <Image
        src={thumbnailUrl}
        alt="Shot card thumbnail"
        fill
        priority
        className={cn(
          "absolute top-0 left-0 z-10 object-cover transition-all w-full h-full",
          showPreview ? "opacity-0" : "opacity-100",
        )}
      />
      <Image
        src={shotPreviewUrl}
        alt="Shot card preview"
        fill
        loading="lazy"
        className="object-cover absolute top-0 left-0 z-0 w-full h-full"
      />
    </Link>
  );
};
