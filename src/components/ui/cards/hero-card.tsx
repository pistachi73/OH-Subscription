import { type Transition, m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { useLikeProgram } from "@/components/programs/hooks/use-like-program";
import { ProgramMainCTAButton } from "@/components/programs/program-play-button";
import { Button } from "@/components/ui/button";
import { HeroImage } from "@/components/ui/hero-image";
import { InfoOutlineIcon } from "@/components/ui/icons";
import { LikeButton, LikeButtonIcon } from "@/components/ui/like-button";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import { SubscribedBanner } from "@/components/ui/subscribed-banner";

import { springTransition } from "@/lib/animation";
import { cn } from "@/lib/utils";

import type { ProgramCard } from "@/server/db/schema.types";

const DELAY_INCREMENT = 0.08;
const DELAY_START = 0.8;
const getAnimateTransition = (index: number): Transition => ({
  ...springTransition,
  delay: DELAY_START + DELAY_INCREMENT * index,
});

const getExitTransition = (index: number): Transition => ({
  ...springTransition,
  delay: DELAY_INCREMENT * index,
});

const MotionImage = m(Image);

type HeroCardProps = {
  className?: string;
  program: NonNullable<ProgramCard>;
  index?: number;
  active?: boolean;
};

export const heroCardHeightProps =
  "h-[70vw] landscape:max-h-[80vh] sm:landscape:max-h-[65vh] sm:min-h-[500px] xs:h-[65vw] sm:h-[46vw]";

export const HeroCard = React.forwardRef<HTMLDivElement, HeroCardProps>(
  ({ className, index, program, active = false }, ref) => {
    const { id, title, slug, description, thumbnail, lastWatchedChapter } =
      program;

    const { isLikedByUser, isLikeLoading, likeProgram } = useLikeProgram({
      initialLiked: program.isLikedByUser,
    });

    return (
      <m.div
        ref={ref}
        className={cn(
          heroCardHeightProps,
          className,
          "absolute top-0 left-0 w-full h-full",
        )}
        initial={{ zIndex: 0 }}
        animate={{ zIndex: 0 }}
        exit={{
          zIndex: 10,
          transition: { delay: 0 },
        }}
      >
        <m.div
          className={cn(
            "absolute left-0 top-0 -z-10 flex aspect-video w-full h-[calc(100%+4rem)]  sm:h-[calc(100%+8rem)]",
          )}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { ...springTransition, delay: 0.5 },
          }}
          transition={springTransition}
        >
          <HeroImage
            src={program?.thumbnail}
            fallbackSrc={
              (index ?? 0) % 2 === 0
                ? "/images/hero-thumbnail-2.jpg"
                : "/images/hero-background.png"
            }
            alt="Hero background image"
            containerClassname="h-full"
          />
        </m.div>

        <MaxWidthWrapper
          className={cn(
            "absolute bottom-0 sm:bottom-8 left-0 z-30 mx-0 flex flex-col justify-end gap-4 md:gap-8",
            "sm:max-w-[45ch]",
            "md:max-w-[56ch]",
            "xl:max-w-[64ch]",
            "2xl:max-w-[72ch]",
          )}
        >
          <div className="space-y-1 sm:space-y-3 lg:space-y-6">
            <MotionImage
              src="/images/test.svg"
              alt="Program Title"
              className={cn("w-full dark:invert")}
              width={0}
              height={0}
              sizes="100vw"
              style={{
                height: "auto",
              }}
              priority
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: getAnimateTransition(0),
              }}
              exit={{ opacity: 0, y: -40, transition: getExitTransition(0) }}
            />
            <h1
              className={cn(
                "sr-only text-balance text-left text-xl font-bold tracking-tighter text-foreground capitalize  max-w-[90%]",
                "sm:text-4xl",
                "lg:text-5xl",
                "2xl:text-6xl",
              )}
            >
              {title ? title : "Advanced English Conversation"}
            </h1>
            <m.p
              className={cn(
                "mb-2 line-clamp-3 w-full text-left text-base text-foreground",
                "sm:line-clamp-4",
                "md:text-lg hidden",
              )}
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: getAnimateTransition(1),
              }}
              exit={{ opacity: 0, y: -40, transition: getExitTransition(1) }}
            >
              {description
                ? description
                : "Tailored for advanced learners, this course focuses on real-life scenarios, idiomatic expressions, and nuanced vocabulary to enhance conversational fluency through role-plays and discussions, empowering confident communication in English-speaking environments."}
            </m.p>
          </div>

          <m.div
            className={cn("w-full")}
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: getAnimateTransition(2),
            }}
            exit={{ opacity: 0, y: -40, transition: getExitTransition(2) }}
          >
            <SubscribedBanner className="mb-3" />
            <div className="flex flex-row items-center gap-6">
              <ProgramMainCTAButton
                program={program}
                navigationMode="details"
                size="hero"
              />
              <div className="flex items-center gap-1 md:gap-2">
                <ResponsiveTooltip>
                  <ResponsiveTooltipTrigger asChild>
                    <LikeButton
                      variant="accent"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0"
                      isLikedByUser={isLikedByUser ?? false}
                      isLikeLoading={isLikeLoading}
                      likeProgram={() => likeProgram({ programId: program.id })}
                    >
                      <LikeButtonIcon className="w-5 h-5 md:w-7 md:h-7" />
                    </LikeButton>
                  </ResponsiveTooltipTrigger>
                  <ResponsiveTooltipContent
                    sideOffset={12}
                    side="bottom"
                    className="p-2 px-3"
                  >
                    <p className="text-lg font-medium text-foreground">
                      {isLikedByUser
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </p>
                  </ResponsiveTooltipContent>
                </ResponsiveTooltip>
                <ResponsiveTooltip>
                  <ResponsiveTooltipTrigger asChild>
                    <Button
                      variant="accent"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0"
                      asChild
                    >
                      <Link href={`/programs/${slug}`}>
                        <InfoOutlineIcon className="w-5 h-5 md:w-7 md:h-7" />
                      </Link>
                    </Button>
                  </ResponsiveTooltipTrigger>
                  <ResponsiveTooltipContent
                    sideOffset={12}
                    side="bottom"
                    className="p-2 px-3"
                  >
                    <p className="text-lg font-medium text-foreground">
                      Details
                    </p>
                  </ResponsiveTooltipContent>
                </ResponsiveTooltip>
              </div>
            </div>
          </m.div>
        </MaxWidthWrapper>
      </m.div>
    );
  },
);

HeroCard.displayName = "HeroCard";
