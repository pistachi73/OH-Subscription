"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { ProgramSpotlight } from "@/server/db/schema.types";

type ChapterProps = {
  chapter: NonNullable<ProgramSpotlight>["chapters"][0];
};

export const Chapter = ({ chapter }: ChapterProps) => {
  return (
    <div className="w-full">
      <Link
        href={`chapters/${chapter.slug}`}
        className="group relative block aspect-video w-full  rounded-xl overflow-hidden"
      >
        <Image
          src={chapter.thumbnail ?? "/images/hero-thumbnail-2.jpg"}
          alt="video"
          fill
          className="object-cover"
        />
        <Button
          className={cn(
            "w-16 h-16 rounded-full scale-75 opacity-0 transition-all shrink-0",
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
            "flex items-center justify-center",
            "group-hover:scale-100 group-hover:opacity-100",
          )}
        >
          <PlayIcon className="w-6 h-6" />
        </Button>
      </Link>
      <div className="mt-4 ">
        <p className="text-muted-foreground font-medium tracking-tight text-sm">
          CHAPTER {chapter.chapterNumber}
        </p>
        <h2 className="mt-px line-clamp-1 w-full gap-3 text-foreground text-lg font-semibold tracking-tighter">
          {chapter.title}
        </h2>

        <p className="mt-1 sm:mt-2 text-base leading-relaxed  text-foreground line-clamp-4">
          {chapter.description}
        </p>
      </div>
    </div>
  );
};
