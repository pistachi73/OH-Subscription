import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import {
  ChapterOutlineIcon,
  InfoOutlineIcon,
  PlayIcon,
} from "@/components/ui/icons";
import { LikeButton, LikeButtonIcon } from "@/components/ui/like-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cardsEase } from "@/lib/animation";
import { levelMap } from "@/lib/formatters/formatLevel";
import { cn, getImageUrl } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";
import { AnimatePresence, m } from "framer-motion";
import { User } from "lucide-react";
import { useState } from "react";
import { useLikeProgram } from "./hooks/use-like-program";

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
            className="relative w-full h-full block"
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
              {lastWatchedChapter ? (
                <m.span className="absolute bottom-full left-0 w-full h-[6px] bg-accent/80 block">
                  <span
                    className="bg-secondary h-full  block"
                    style={{
                      width: `${lastWatchedChapter.progress}%`,
                    }}
                  />
                </m.span>
              ) : null}
              <section className="flex flex-row justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
                    asChild
                  >
                    <Link href={chapterHref}>
                      <PlayIcon className="ml-0.5 w-7 h-7" />
                    </Link>
                  </Button>
                  <p className="font-semibold tracking-tight text-base text-muted-foreground">
                    {program.lastWatchedChapter
                      ? `Resume C${program.lastWatchedChapter.chapterNumber}`
                      : "Start watching"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
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

              <section className="mt-2 space-y-0.5">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="line-clamp-2 text-base text-foreground">
                  {description}
                </p>
              </section>
              <section className="mt-3 flex flex-row items-center gap-1 flex-wrap">
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
              </section>
              <section className="mt-5 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  {teachers?.map(({ id, image, name }, index) => (
                    <Tooltip key={`teacher_${id}_${program.id}`}>
                      <TooltipTrigger asChild>
                        <Avatar
                          className={cn(
                            "h-14 w-14 border-2",
                            index !== 0 && "-ml-3",
                          )}
                        >
                          <AvatarImage
                            src={image ? getImageUrl(image) : undefined}
                          />
                          <AvatarFallback className="bg-accent relative">
                            <Image
                              src="/images/avatar-placeholder.png"
                              fill
                              alt="teacher avatar placeholder"
                            />

                            <User
                              className="text-accent-foreground"
                              size={20}
                            />
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent
                        align="center"
                        side="top"
                        className="p-1 px-3 text-center"
                      >
                        <p className="text-sm  text-foreground">{name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Teacher at OH
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-1 text-foreground">
                  <ChapterOutlineIcon className="fill-foreground w-9 h-9" />
                  <p className="text-xs text-muted-foreground">
                    {totalChapters} chapters
                  </p>
                </div>
              </section>
            </m.article>
          )}
        </AnimatePresence>
      </section>
    </article>
  );
};
