import type { Transition } from "framer-motion";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomImage } from "@/components/ui/custom-image";
import { InfoOutlineIcon } from "@/components/ui/icons";
import { LikeButton, LikeButtonIcon } from "@/components/ui/like-button";
import { SubscribedBanner } from "@/components/ui/subscribed-banner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserProgressBar } from "@/components/ui/user-progress-bar";
import { levelMap } from "@/lib/formatters/formatLevel";
import { cn } from "@/lib/utils";

import { useLikeProgram } from "./hooks/use-like-program";
import { ProgramMainCTAButton } from "./program-play-button";

import type { RouterOutputs } from "@/trpc/shared";

const MotionLink = m(Link);

export type ProgramCardProps = {
  isLeftBorder?: boolean;
  isRightBorder?: boolean;
  program: RouterOutputs["program"]["getProgramsForCards"][0];
  index?: number;
  priority?: boolean;
};

export const ProgramCard = ({
  isLeftBorder,
  isRightBorder,
  program,
  priority = false,
}: ProgramCardProps) => {
  const onHoverTimeoutRef = useRef<NodeJS.Timeout>();
  const [isHovered, setIsHovered] = useState(false);

  const {
    level,
    thumbnail,
    description,
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

  const onMouseEnter = () => {
    if (onHoverTimeoutRef.current) {
      clearTimeout(onHoverTimeoutRef.current);
    }
    onHoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 300);
  };

  const onMouseLeave = () => {
    if (onHoverTimeoutRef.current) {
      clearTimeout(onHoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  const transition: Transition = useMemo(
    () => ({
      type: "spring",
      mass: 1,
      stiffness: 400,
      damping: 35,
    }),
    [],
  );

  return (
    <m.article
      className="group relative flex aspect-video h-full w-full"
      initial="initial"
      whileHover="hover"
      onHoverStart={onMouseEnter}
      onHoverEnd={onMouseLeave}
    >
      <section
        className={cn(
          "relative w-full h-full transition-all delay-300 z-0",
          "group-hover:z-20 group-hover:delay-0",
        )}
      >
        <m.div
          className={cn(
            "w-full h-full",
            isLeftBorder && "origin-left",
            isRightBorder && "origin-right",
          )}
          variants={{
            initial: { scale: 1, y: 0 },
            hover: {
              scale: 1.25,
              y: -50,
              transition: { ...transition, delay: 0.3 },
            },
          }}
          transition={transition}
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

          <MotionLink
            href={`/programs/${slug}`}
            className="relative w-full h-full block overflow-hidden aspect-video"
            variants={{
              initial: {
                borderRadius: 8,
              },
              hover: {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                transition: {
                  duration: 0.3,
                },
              },
            }}
          >
            <CustomImage
              src={thumbnail}
              fallbackSrc="/images/video-thumbnail.png"
              alt="video"
              priority={priority}
              fill
              sizes={`(max-width: 640px) 50vw,
                      (max-width: 1024px) 33vw,
                      (max-width: 1280px) 25vw,
                      20vw`}
            />
            <UserProgressBar
              progress={lastWatchedChapter?.progress}
              className="absolute bottom-0 left-0 w-full z-30"
              progressClassName="rounded-none"
            />
          </MotionLink>
        </m.div>

        <AnimatePresence initial={false}>
          {isHovered && (
            <m.article
              key={`progra-card-details-${program.slug}`}
              initial={{ opacity: 0.5, y: -2, top: "100%", scale: 0.8 }}
              animate={{
                opacity: 1,
                top: "112.5%",
                y: -51,
                scale: 1,
                transition,
              }}
              exit={{
                opacity: 0,
                y: 0,
                scale: 0.8,
                top: "100%",
                transition: {
                  ease: "easeOut",
                  duration: 0.1,
                },
              }}
              className={cn(
                "p-4 bg-background rounded-b-lg absolute left-[-12.5%]  w-[125%] ",
                "group-hover:shadow-lg origin-top",
                isLeftBorder && "left-0 origin-top-left",
                isRightBorder && "left-[-25%] origin-top-right",
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
                <p className="mt-3 line-clamp-3 text-base text-foreground font-medium">
                  {description}
                </p>
              </section>
            </m.article>
          )}
        </AnimatePresence>
      </section>
    </m.article>
  );
};
