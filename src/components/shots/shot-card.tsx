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
      className="w-full h-full bg-muted rounded-md relative overflow-hidden aspect-[9/16] flex items-end px-3 py-2"
      onMouseEnter={() => {
        previewTimeoutRef.current = setTimeout(() => setShowPreview(true), 400);
      }}
      onMouseLeave={() => {
        setShowPreview(false);
        if (previewTimeoutRef.current) {
          clearTimeout(previewTimeoutRef.current);
        }
      }}
    >
      <p className="relative z-30 font-medium line-clamp-2 text-lg text-white">
        {shot.title}
      </p>
      <Image
        src={thumbnailUrl}
        alt="Shot card thumbnail"
        fill
        priority
        className={cn(
          "relative z-10 object-cover transition-all aspect-[9/16]",
          showPreview ? "opacity-0" : "opacity-100",
        )}
      />
      <Image
        src={shotPreviewUrl}
        alt="Shot card preview"
        fill
        loading="lazy"
        className="object-cover relative z-0 aspect-[9/16]"
      />
    </Link>
  );
};
