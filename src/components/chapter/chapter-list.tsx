import { Button } from "@/components/ui/button";
import { MustBeLoggedIn } from "@/components/ui/comments/must-be-logged-in";
import { PlayCircleIcon, PlayIcon } from "@/components/ui/icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import type { ProgramSpotlight } from "@/server/db/schema.types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useChapterContext } from "./chapter-context";

export const ChapterList = () => {
  const user = useCurrentUser();
  return user ? (
    <ChapterListContent />
  ) : (
    <div className="px-4 flex items-center justify-center h-full py-4 w-full">
      <MustBeLoggedIn />
    </div>
  );
};

const ChapterListContent = () => {
  const { program } = useChapterContext();
  const params = useParams();

  return (
    <div className="p-4 flex flex-col gap-3">
      {program.chapters.map((chapter, index) => {
        const isActiveChapter = params.chapterSlug === chapter.slug;

        return isActiveChapter ? (
          <ActiveChapterCard key={chapter.slug} chapter={chapter} />
        ) : (
          <InactiveChapterCard
            key={chapter.slug}
            chapter={chapter}
            programSlug={program.slug}
          />
        );
      })}
    </div>
  );
};

export const InactiveChapterCard = ({
  programSlug,
  chapter,
}: {
  chapter: NonNullable<ProgramSpotlight>["chapters"][0];
  programSlug: string;
}) => {
  if (!chapter) return null;
  return (
    <Link
      key={chapter.slug}
      className={cn(
        "shrink-0 group w-full rounded-lg relative overflow-hidden bg-muted flex justify-between items-center p-3 gap-4",
      )}
      href={`/programs/${programSlug}/chapters/${chapter.slug}`}
    >
      <div className="relative z-10 w-full">
        <p className="text-sm text-muted-foreground mb-0.5">
          {chapter.duration} min
        </p>
        <p className="w-full gap-3 leading-normal text-foreground text-base md:text-xl font-medium tracking-tighter">
          {chapter.title}
        </p>
      </div>
      <Button
        className={cn(
          "w-14 h-14 rounded-full scale-75 opacity-0 transition-all shrink-0",
          "flex items-center justify-center",
          "group-hover:scale-100 group-hover:opacity-100",
        )}
      >
        <PlayIcon className="w-6 h-6" />
      </Button>
    </Link>
  );
};

export const ActiveChapterCard = ({
  chapter,
}: {
  chapter: NonNullable<ProgramSpotlight>["chapters"][0];
}) => {
  return (
    <div
      className={cn(
        "shrink-0 group w-full rounded-lg relative overflow-hidden bg-muted ",
      )}
    >
      <div className="relative  w-full flex flex-col items-end justify-end">
        <div className="absolute aspect-video top-0 left-0 w-full overflow-hidden">
          <Image
            src={chapter.thumbnail ?? "/images/hero-thumbnail-2.jpg"}
            alt="video"
            fill
            className="object-cover"
          />
          <div className="z-0 absolute top-0 left-0 h-full w-full bg-gradient-to-t from-10% from-muted" />
        </div>
        <div className={cn("relative w-full p-3  pt-[40%]")}>
          <div className="relative z-10 w-full h-full">
            <span className="text-xs text-secondary mb-1 flex items-center gap-1">
              <PlayCircleIcon className="w-4 h-4" />
              Currenty playing
            </span>
            <p className="w-full gap-3 text-foreground text-base md:text-xl font-semibold tracking-tight">
              {chapter.title}
            </p>
            <p className="mt-1 text-sm md:text-base leading-relaxed  text-foreground line-clamp-4">
              {chapter.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
