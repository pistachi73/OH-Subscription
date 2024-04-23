import { LibraryBig } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

type PlaylistChapterProps = {
  title: string;
  chapterNumber: number;
};
export const PlaylistChapter = ({
  title,
  chapterNumber,
}: PlaylistChapterProps) => {
  return (
    <Link
      href={"/"}
      className="flex flex-row items-center gap-2 py-2 pl-2 pr-6 hover:bg-muted/50"
    >
      <div className="flex w-3 items-center justify-center">
        <p className="text-xs text-muted-foreground">{chapterNumber}</p>
      </div>
      <div className="flex flex-row gap-2">
        <div className="relative aspect-video w-[80px] shrink-0 overflow-hidden rounded-sm sm:w-[100px]">
          <Image src={"/images/hero-thumbnail-2.jpg"} alt="video" fill />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium sm:text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">12 min</p>
        </div>
      </div>
    </Link>
  );
};

export const ChapterPlayList = () => {
  return (
    <div className="flex h-0 min-h-full  w-full flex-1 flex-col rounded-b-sm border border-muted sm:rounded-md">
      <div className="bg-muted/50 p-2">
        {/* <p className="text-base font-medium">English around the world</p> */}
        <p className="flex items-center text-xs font-medium text-foreground">
          <LibraryBig size={12} className="mr-0.5" />
          Chapter 2 of 18
        </p>
      </div>
      <div className="overflow-y-scroll">
        {[...Array(18)].map((_, index) => (
          <PlaylistChapter
            key={index}
            title="Unlocking vocabulary for learning"
            chapterNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
};
