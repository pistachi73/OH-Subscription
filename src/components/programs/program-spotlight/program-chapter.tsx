"use client";

import { buttonVariants } from "@/components/ui/button";
import { PersonAccountsIcon, PlayIcon } from "@/components/ui/icons";
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder";
import { SubscribedBanner } from "@/components/ui/subscribed-banner";
import { UserProgressBar } from "@/components/ui/user-progress-bar";
import { UserStatusLink } from "@/components/ui/user-status-link";
import { useUserStatus } from "@/hooks/use-user-status";
import { cn } from "@/lib/utils/cn";
import type { ProgramSpotlight } from "@/server/db/schema.types";

type ChapterProps = {
  chapter: NonNullable<NonNullable<ProgramSpotlight>["chapters"]>[0];
};

export const Chapter = ({ chapter }: ChapterProps) => {
  const userStatus = useUserStatus();

  const canSeeChapter = userStatus === "LOGGED_IN_SUBSCRIBED" || chapter.isFree;

  const { userProgress } = chapter;
  return (
    <article className="w-full">
      <UserStatusLink
        href={
          userProgress
            ? `chapters/${chapter.slug}?start=${userProgress.watchedDuration}`
            : `chapters/${chapter.slug}`
        }
        requiredSubscription={!chapter.isFree}
        className={cn(
          "group relative block aspect-video w-full  rounded-xl overflow-hidden",
        )}
      >
        <ImageWithPlaceholder
          src={chapter.thumbnail}
          fallbackSrc="/images/hero-thumbnail-2.jpg"
          alt="Program Chapter Thumbnail"
          fill
          priority
          sizes={`
            (max-width: 640px) 100vw,
            (max-width: 1024px) 50vw,
            (max-width: 1280px) 33vw,
            25vw`}
        />
        <div
          className={cn(
            buttonVariants({
              variant: canSeeChapter ? "default" : "secondary",
            }),
            "w-16 h-16 rounded-full scale-75 opacity-0 transition-all shrink-0",
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
            "flex items-center justify-center",
            "group-hover:scale-100 group-hover:opacity-100",
          )}
        >
          {canSeeChapter ? (
            <PlayIcon className="w-6 h-6" />
          ) : (
            <PersonAccountsIcon className="w-6 h-6" />
          )}
        </div>
        <UserProgressBar
          progress={chapter.userProgress?.progress}
          className="absolute bottom-0 left-0 w-full z-30"
        />
      </UserStatusLink>
      {userStatus !== "LOGGED_IN_SUBSCRIBED" && chapter.isFree && (
        <span className="block text-sm mt-2 text-muted-foreground bg-muted px-2 py-[6px] rounded-md w-full">
          Free chapter
        </span>
      )}
      {userStatus !== "LOGGED_IN_SUBSCRIBED" && !chapter.isFree && (
        <SubscribedBanner className="text-sm mt-2 text-muted-foreground bg-muted px-2 py-[6px] rounded-md">
          Auto-renews at €4.99/month after trial
        </SubscribedBanner>
      )}
      <section className="mt-4 ">
        <p className="text-muted-foreground font-medium tracking-tight text-sm">
          CHAPTER {chapter.chapterNumber}
        </p>
        <h2 className="mt-px line-clamp-1 w-full gap-3 text-foreground text-lg font-semibold tracking-tighter">
          {chapter.title}
        </h2>

        <p className="mt-1 sm:mt-2 text-base leading-relaxed  text-foreground line-clamp-4">
          {chapter.description}
        </p>
      </section>
    </article>
  );
};
