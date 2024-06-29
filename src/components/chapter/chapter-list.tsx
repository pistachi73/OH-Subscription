import { Button } from "@/components/ui/button";
import { MustBeLoggedIn } from "@/components/ui/comments/must-be-logged-in";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ChapterProps } from "./chapter";
import { useChapterContext } from "./chapter-context";
import { ChapterSideWrapper } from "./chapter-side-wrapper";

type ChapterListProps = Omit<ChapterProps, "chapter">;

export const ChapterList = ({ program }: ChapterListProps) => {
  const { activeTab, setActiveTab, autoPlay, setAutoPlay } =
    useChapterContext();
  const user = useCurrentUser();
  const { isMobile } = useDeviceType();
  return (
    <ChapterSideWrapper
      isDialogOpen={activeTab === "chapters"}
      onDialogOpenChange={(open) => {
        if (!open) {
          setActiveTab(null);
        }
      }}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-y-auto no-scrollbar",
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between p-4 lg-p-5 pb-0",
            isMobile && "pt-0",
          )}
        >
          <h2 className={cn("text-base font-medium md:text-lg")}>Chapters</h2>
          <Switch
            checked={autoPlay}
            onCheckedChange={setAutoPlay}
            thumbClassName="flex items-center justify-center"
          >
            {autoPlay ? (
              <PlayIcon className="w-2 h-2 fill-foreground/70" />
            ) : (
              <PauseIcon className="w-2 h-2 fill-foreground/70" />
            )}
          </Switch>
        </div>
        {user ? (
          <ChapterListContent program={program} />
        ) : (
          <div className="px-4 flex items-center justify-center h-full pb-4 w-full">
            <MustBeLoggedIn />
          </div>
        )}
      </div>
    </ChapterSideWrapper>
  );
};

const ChapterListContent = ({ program }: ChapterListProps) => {
  const params = useParams();

  return (
    <div className="p-4 lg:p-5 flex flex-col gap-3">
      {program.chapters.map((chapter, index) => {
        const isActiveChapter = params.chapterSlug === chapter.slug;

        return isActiveChapter ? (
          <ActiveChapterCard
            key={chapter.slug}
            chapter={chapter}
            programSlug={program.slug}
          />
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

const InactiveChapterCard = ({
  programSlug,
  chapter,
}: {
  chapter: ChapterListProps["program"]["chapters"][0];
  programSlug: string;
}) => {
  if (!chapter) return null;
  return (
    <Link
      key={chapter.slug}
      className={cn(
        "group w-full rounded-lg relative overflow-hidden bg-muted flex justify-between items-center p-3 gap-4",
      )}
      href={`/programs/${programSlug}/chapters/${chapter.slug}`}
    >
      <div className="relative z-10 w-full">
        <p className="w-full gap-3 text-foreground text-lg md:text-xl font-medium tracking-tighter dark:text-foreground">
          {chapter.title}
        </p>
        <p className="text-base text-foreground/70 dark:text-foreground/70">
          {chapter.duration} min
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

const ActiveChapterCard = ({
  programSlug,
  chapter,
}: {
  chapter: ChapterListProps["program"]["chapters"][0];
  programSlug: string;
}) => {
  return (
    <div
      className={cn(
        "group w-full rounded-lg relative overflow-hidden bg-dark-accent",
      )}
    >
      <div className="relative aspect-video w-full flex flex-col items-end justify-end">
        <div className="absolute aspect-video top-0 left-0 w-full overflow-hidden">
          <Image
            src={chapter.thumbnail ?? "/images/hero-thumbnail-2.jpg"}
            alt="video"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 w-full p-3 ">
          <div className="absolute bottom-0 left-0 -z-10 h-[140%] w-full bg-gradient-to-t from-[hsl(234.55,22.58%,20.08%)] dark:from-accent" />
          <p className="w-full gap-3 text-dark-foreground text-lg md:text-xl font-medium tracking-tighter">
            {chapter.title}
          </p>
          <p className="text-base text-background/70 dark:text-foreground/70">
            {chapter.duration} min
          </p>
        </div>
      </div>
      <div className={"p-3 pt-1"}>
        <p className="text-base leading-relaxed  text-dark-foreground line-clamp-4">
          {chapter.description}
        </p>
      </div>
    </div>
  );
};
