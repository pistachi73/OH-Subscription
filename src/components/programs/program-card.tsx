import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { InfoOutlineIcon } from "@/components/ui/icons";
import { LikeButton, LikeButtonIcon } from "@/components/ui/like-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsSubscribed } from "@/hooks/use-is-subscribed";
import { cardsEase } from "@/lib/animation";
import { levelMap } from "@/lib/formatters/formatLevel";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";
import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { SubscribedBanner } from "../ui/subscribed-banner";
import { useLikeProgram } from "./hooks/use-like-program";
import { ProgramMainCTAButton } from "./program-play-button";

export type ProgramCardProps = {
  lazy?: boolean;
  isLeftBorder?: boolean;
  isRightBorder?: boolean;
  program: RouterOutputs["program"]["getProgramsForCards"][0];
};

export const ProgramCard = ({
  lazy,
  isLeftBorder,
  isRightBorder,
  program,
}: ProgramCardProps) => {
  const { deviceType } = useDeviceType();
  const isSubscribed = useIsSubscribed();
  const [isHovered, setIsHovered] = useState(false);

  const {
    level,
    thumbnail,
    description,
    teachers,
    slug,
    title,
    totalChapters,
    categories,
    lastWatchedChapter,
    firstChapter,
  } = program;

  const { isLikedByUser, likeProgram, isLikeLoading } = useLikeProgram({
    initialLiked: program.isLikedByUser,
  });

  const chapterHrefPrefix = `/programs/${slug}`;

  const chapterHref = lastWatchedChapter
    ? `${chapterHrefPrefix}/chapters/${lastWatchedChapter.chapterSlug}?start=${Math.floor(lastWatchedChapter.watchedDuration)}`
    : firstChapter
      ? `${chapterHrefPrefix}/chapters/${firstChapter?.chapterSlug}`
      : chapterHrefPrefix;

  const onMouseEnter = () => {
    if (deviceType === "mobile" || deviceType === "tablet") return;
    setIsHovered(true);
  };

  return (
    <article
      className="group relative flex aspect-video h-full w-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <section
        className={cn(
          "relative w-full h-full transition-all delay-300 z-0",
          "group-hover:z-20 group-hover:delay-0",
        )}
      >
        <div
          className={cn(
            "w-full h-full transition-transform ease-card",
            "group-hover:scale-125 group-hover:delay-300",
            isLeftBorder && "origin-left",
            isRightBorder && "origin-right",
          )}
        >
          <Badge
            variant="accent"
            className={cn(
              "absolute left-1 top-1 z-10 h-fit shrink-0 rounded px-1 py-0.5 text-3xs font-medium transition-opacity delay-0 ease-card",
              "group-hover:opacity-0 group-hover:delay-300",
            )}
          >
            {levelMap[level].shortFormat}
          </Badge>

          <Link
            href={`/programs/${slug}`}
            className="relative w-full h-full block rounded-lg group-hover:rounded-b-none overflow-hidden "
          >
            <Image
              src={thumbnail?.src ?? "/images/video-thumbnail.png"}
              alt="video"
              fill
              className={cn(
                "rounded-lg group-hover:rounded-b-none xl:delay-0 group-hover:delay-300  object-cover",
              )}
              {...(thumbnail?.placeholder && {
                placeholder: "blur",
                blurDataURL: thumbnail.placeholder,
              })}
              loading={lazy ? "lazy" : "eager"}
              sizes={`(max-width: 640px) 50vw,
     (max-width: 1024px) 33vw,
     (max-width: 1280px) 25vw,
     20vw`}
            />
            {isSubscribed && lastWatchedChapter ? (
              <section>
                <span className="absolute bottom-0 left-0 w-full h-[5px] bg-accent/80 block">
                  <span
                    className="bg-secondary h-full  block"
                    style={{
                      width: `${lastWatchedChapter.progress}%`,
                    }}
                  />
                </span>
              </section>
            ) : null}
          </Link>
        </div>
        <AnimatePresence>
          {isHovered && (
            <m.article
              initial={{ opacity: 0, top: "107.5%" }}
              animate={{
                opacity: 1,
                top: "112.5%",
                transition: {
                  delay: 0.3,
                  duration: 0.1,
                  ease: cardsEase,
                },
              }}
              className={cn(
                "p-4 bg-background rounded-b-lg opacity-0  delay-0 absolute top-0 left-[-12.5%]  w-[125%] ",
                "group-hover:shadow-lg",
                isLeftBorder && "left-0",
                isRightBorder && "left-[-25%]",
              )}
            >
              <SubscribedBanner className="mb-2 text-muted-foreground text-sm">
                Watch with a 30 day free trial, auto renews at €4.99/month
              </SubscribedBanner>

              <section className="mb-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  {title}
                </h3>
              </section>

              <section className="flex flex-row gap-4 mb-4 w-full flex-wrap">
                <ProgramMainCTAButton
                  program={program}
                  navigationMode="details"
                  size="card"
                  className="grow"
                />
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <LikeButton
                        variant="accent"
                        className="w-12 h-12 rounded-full p-0"
                        isLikedByUser={isLikedByUser ?? false}
                        isLikeLoading={isLikeLoading}
                        likeProgram={() =>
                          likeProgram({ programId: program.id })
                        }
                      >
                        <LikeButtonIcon className="w-6 h-6" />
                      </LikeButton>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6} className="p-1 px-2">
                      <p className="text-sm text-foreground">
                        {isLikedByUser
                          ? "Remove from favorites"
                          : "Add to favorites"}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="accent"
                        className="w-12 h-12 rounded-full p-0"
                        asChild
                      >
                        <Link href={`/programs/${slug}`}>
                          <InfoOutlineIcon className="w-6 h-6" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6} className="p-1 px-2">
                      <p className="text-sm text-foreground">Details</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </section>

              <section className="mb-3 flex flex-row items-center gap-x-1 gap-y-2 flex-wrap">
                <Badge variant={"accent"} className="">
                  {levelMap[level].shortFormat}
                </Badge>
                {categories?.map((category) => (
                  <Badge
                    key={`category-${category.name}`}
                    variant="outline"
                    className=""
                  >
                    {category.name}
                  </Badge>
                ))}
                <span className="text-sm text-muted-foreground">
                  {totalChapters} chapters
                </span>
              </section>
              <section>
                <p className="mt-3 line-clamp-3 text-base text-foreground">
                  {description}
                </p>
              </section>
            </m.article>
          )}
        </AnimatePresence>
      </section>
    </article>
  );
};
