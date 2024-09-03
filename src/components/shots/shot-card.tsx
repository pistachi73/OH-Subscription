"use client";

import Image from "next/image";
import { useState } from "react";

import { SubscribedBanner } from "@/components/ui/subscribed-banner";
import { UserStatusLink } from "@/components/ui/user-status-link";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { cn } from "@/lib/utils/cn";
import type { ShotCard as ShotCardType } from "@/types";

export const ShotCard = ({ shot }: { shot: ShotCardType }) => {
  const isMounted = useIsMounted();
  const [showPreview, setShowPreview] = useState(false);

  const thumbnailUrl = `https://image.mux.com/${shot.playbackId}/thumbnail.webp?width=900&height=1600&time=4`;
  const shotPreviewUrl = `https://image.mux.com/${shot.playbackId}/animated.webp?width=320`;

  return (
    <UserStatusLink
      href={`/shots/${shot.slug}`}
      className="w-full aspect-[9/16] bg-muted rounded-md relative overflow-hidden flex items-end z-0"
      onMouseEnter={() => {
        setShowPreview(true);
      }}
      onMouseLeave={() => {
        setShowPreview(false);
      }}
    >
      <div
        className={cn(
          "absolute bottom-0 left-0 *:w-full px-2 py-2 w-full  z-30",
          "before:absolute before:-z-10 before:left-0 before:bottom-0 before:h-[200%] before:w-full before:bg-gradient-to-t from-muted-background/70 to-background/0 ",
        )}
      >
        <p className="text-left line-clamp-2 text-sm font-medium text-white leading-relaxed">
          {shot.title}
        </p>
        <SubscribedBanner className="text-sm bg-muted-background text-left p-1 rounded-sm my-2">
          Watch with free trial
        </SubscribedBanner>
      </div>

      <Image
        src={thumbnailUrl}
        alt="Shot card thumbnail"
        fill
        className={cn(
          "absolute top-0 left-0 z-10 object-cover ease-in-out transition-opacity duration-300 w-full h-full",
          showPreview ? "opacity-0 delay-400" : "opacity-100 delay-0",
        )}
      />
      <Image
        src={shotPreviewUrl}
        alt="Shot card preview"
        fill
        loading="lazy"
        className={cn(
          "object-cover absolute top-0 left-0 z-0 w-full h-full ",
          isMounted() ? "opacity-100 " : "opacity-0",
        )}
      />
    </UserStatusLink>
  );
};
