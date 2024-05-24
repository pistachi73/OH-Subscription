import { cn } from "@/lib/utils";
import type { ProgramSpotlight } from "@/server/db/schema.types";
import { LibraryBig } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

type PlaylistChapterProps = {
  chapter: NonNullable<ProgramSpotlight>["chapters"][0];
  chapterNumber: number;
  programSlug: string;
  isSelectedChapter: boolean;
};
export const PlaylistChapter = ({
  chapter,
  chapterNumber,
  programSlug,
  isSelectedChapter = false,
}: PlaylistChapterProps) => {
  return (
    <Link
      href={`/programs/${programSlug}/chapters/${chapter.slug}`}
      className={cn(
        "flex flex-row items-center gap-2 py-2 pl-2 pr-6 hover:bg-muted/50",
        isSelectedChapter ? "bg-muted/30" : "",
      )}
    >
      <div className="flex w-3 items-center justify-center">
        <p className="text-xs text-muted-foreground">{chapterNumber}</p>
      </div>
      <div className="flex flex-row gap-2">
        <div className="relative aspect-video w-[80px] shrink-0 overflow-hidden rounded-sm sm:w-[100px]">
          <Image
            src={chapter.thumbnail ?? "/images/hero-thumbnail-2.jpg"}
            alt="video"
            fill
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium sm:text-sm">{chapter.title}</p>
          <p className="text-xs text-muted-foreground">
            {chapter.duration} min
          </p>
        </div>
      </div>
    </Link>
  );
};

type ChapterPlayListProps = {
  program: NonNullable<ProgramSpotlight>;
  currentChapter: number;
};

export const ChapterPlayList = ({
  program,
  currentChapter,
}: ChapterPlayListProps) => {
  if (!program.chapters?.length) return null;

  return (
    <div className="flex h-0 min-h-full  w-full flex-1 flex-col rounded-b-sm border bg-background sm:rounded-md">
      <div className="bg-muted/50 border-b p-2">
        {/* <p className="text-base font-medium">English around the world</p> */}
        <p className="flex items-center text-xs font-medium text-foreground">
          <LibraryBig size={12} className="mr-0.5" />
          Chapter {currentChapter} of {program.chapters.length}
        </p>
      </div>
      <div className="overflow-y-scroll">
        {program.chapters.map((chapter, index) => (
          <PlaylistChapter
            key={chapter.slug}
            chapter={chapter}
            chapterNumber={index + 1}
            isSelectedChapter={index + 1 === currentChapter}
            programSlug={program.slug}
          />
        ))}
      </div>
    </div>
  );
};
