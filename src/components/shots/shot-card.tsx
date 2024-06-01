"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";

export const ShotCard = () => {
  const [showPreview, setShowPreview] = useState(false);
  const previewTimeoutRef = useRef<NodeJS.Timeout>();

  return (
    <div
      className="w-full h-full bg-muted rounded-md relative overflow-hidden aspect-[9/16]"
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
      <Image
        src="https://image.mux.com/IlfobVwONwzhT6601yU9pth26n8gl02oBvHxGmzuMsBz4/thumbnail.webp?width=900&height=1600&time=2"
        alt="Shot card"
        fill
        priority
        className={cn(
          "relative z-20 object-cover transition-all aspect-[9/16]",
          showPreview ? "opacity-0" : "opacity-100",
        )}
      />
      <Image
        src="https://image.mux.com/IlfobVwONwzhT6601yU9pth26n8gl02oBvHxGmzuMsBz4/animated.webp?width=320"
        alt="Shot card"
        fill
        loading="lazy"
        className="object-cover relative z-10 aspect-[9/16]"
      />
    </div>
  );
};
