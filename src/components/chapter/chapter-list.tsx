import {
  PersonAccountsIcon,
  PlayCircleIcon,
  PlayIcon,
} from "@/components/ui/icons";
import { useIsSubscribed } from "@/hooks/use-is-subscribed";
import { cn } from "@/lib/utils";
import type { ProgramSpotlight } from "@/server/db/schema.types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { SubscribedBanner } from "../ui/subscribed-banner";
import { UserStatusLink } from "../ui/user-status-link";
import { useChapterContext } from "./chapter-context";

export const ChapterList = () => {
  return <ChapterListContent />;
};

const ChapterListContent = () => {
  const { program } = useChapterContext();
  const params = useParams();

  return (
    <div className="p-4 flex flex-col gap-3 overflow-y-auto no-scrollbar">
      {program.chapters?.map((chapter) => {
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
  chapter: NonNullable<NonNullable<ProgramSpotlight>["chapters"]>[0];
  programSlug: string;
}) => {
  const isSubscribed = useIsSubscribed();
  const canSeeChapter = isSubscribed || chapter.isFree;

  if (!chapter) return null;
  return (
    <UserStatusLink
      key={chapter.slug}
      href={`/programs/${programSlug}/chapters/${chapter.slug}`}
      requiredSubscription={!chapter.isFree}
      className={cn(
        "shrink-0 group w-full rounded-lg relative overflow-hidden bg-muted gap-4",
        "flex items-center justify-between",
        "p-3 md:p-4",
      )}
    >
      <div className="relative z-10 w-full">
        {isSubscribed ? (
          <p className="text-sm text-muted-foreground mb-0.5">
            {chapter.duration} min
          </p>
        ) : (
          <SubscribedBanner className="text-base mb-1 text-muted-foreground">
            Start your 30-day free trial
          </SubscribedBanner>
        )}

        <p className="w-full gap-3 text-left leading-normal text-foreground text-lg font-semibold tracking-tight">
          {chapter.title}
        </p>
      </div>

      <div
        className={cn(
          buttonVariants({ variant: "default" }),
          "w-14 h-14 rounded-full scale-75 opacity-0 transition-all shrink-0 ",
          "flex items-center justify-center",
          "group-hover:scale-100 group-hover:opacity-100",
        )}
      >
        {canSeeChapter ? (
          <PlayIcon className="w-6 h-6" />
        ) : (
          <PersonAccountsIcon className="w-7 h-7" />
        )}
      </div>
    </UserStatusLink>
  );
};

export const ActiveChapterCard = ({
  chapter,
}: {
  chapter: NonNullable<NonNullable<ProgramSpotlight>["chapters"]>[0];
}) => {
  const isSubscribed = useIsSubscribed();
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
            sizes={"400px"}
          />
          <div className="z-0 absolute top-0 left-0 h-full w-full bg-gradient-to-t from-10% from-muted" />
        </div>
        <div
          className={cn("relative w-full", "p-3 pt-[40%] md:p-4 md:pt-[40%]")}
        >
          <div className="relative z-10 w-full h-full">
            <span className="text-xs text-secondary mb-1 flex items-center gap-1">
              <PlayCircleIcon className="w-4 h-4" />
              {isSubscribed ? "Currenty playing" : "Free chapter"}
            </span>
            <p className="w-full gap-3 text-foreground text-lg font-semibold tracking-tight">
              {chapter.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
