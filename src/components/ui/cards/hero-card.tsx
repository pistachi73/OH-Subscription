import React from "react";

import Link from "next/link";

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
import { useIsSubscribed } from "@/hooks/use-is-subscribed";
import { cn } from "@/lib/utils";
import type { ProgramCard } from "@/server/db/schema.types";
import Image from "next/image";
import { SubscribedBanner } from "../subscribed-banner";

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

    const isSubscribed = useIsSubscribed();
    const { isLikedByUser, isLikeLoading, likeProgram } = useLikeProgram({
      initialLiked: program.isLikedByUser,
    });

    return (
      <div
        ref={ref}
        className={cn(
          heroCardHeightProps,
          className,
          "transition-opacity duration-500 ease-in-out",
          active ? "opacity-100 z-10 " : "pointer-events-none opacity-0 ",
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 -z-10 flex aspect-video w-full h-[calc(100%+4rem)]  sm:h-[calc(100%+8rem)]",
          )}
        >
          <HeroImage
            src={
              program?.thumbnail
                ? program.thumbnail.src
                : index ?? 0 % 2 === 0
                  ? "/images/hero-thumbnail-2.jpg"
                  : "/images/hero-background.png"
            }
            priority={active}
            alt="Hero background image"
            containerClassname="h-full"
            {...(program?.thumbnail?.placeholder && {
              placeholder: "blur",
              blurDataURL: program.thumbnail.placeholder,
            })}
          />
        </div>

        <MaxWidthWrapper
          className={cn(
            "mb-6 sm:mb-0 absolute bottom-0 sm:bottom-8 left-0 z-30 mx-0 flex flex-col justify-end gap-8",
            "sm:max-w-[45ch]",
            "md:max-w-[56ch]",
            "xl:max-w-[64ch]",
            "2xl:max-w-[72ch]",
          )}
        >
          <div className="space-y-1 sm:space-y-3 lg:space-y-6">
            <Image
              src="/images/test.svg"
              alt="test"
              className={cn(
                "w-full dark:invert ",
                "opacity-0 translate-y-10 w-3/4 lg:w-[90%]",
                active &&
                  "animate-show-hero-card-content fill-mode-forwards delay-600",
              )}
              width={0}
              height={0}
              sizes="100vw"
              style={{
                height: "auto",
              }}
            />
            {/* <h1
              className={cn(
                "text-balance text-left text-xl font-bold tracking-tighter text-foreground capitalize  max-w-[90%]",
                "sm:text-4xl",
                "lg:text-5xl",
                "2xl:text-6xl",
                "opacity-0 translate-y-10",
                active &&
                  "animate-show-hero-card-content fill-mode-forwards delay-600",
              )}
            >
              {title ? title : "Advanced English Conversation"}
            </h1> */}
            <p
              className={cn(
                "mb-2 line-clamp-3 w-full text-left text-base text-foreground",
                "sm:line-clamp-4",
                "md:text-lg hidden",
                "opacity-0 translate-y-10",
                active &&
                  " animate-show-hero-card-content fill-mode-forwards delay-700",
              )}
            >
              {description
                ? description
                : "Tailored for advanced learners, this course focuses on real-life scenarios, idiomatic expressions, and nuanced vocabulary to enhance conversational fluency through role-plays and discussions, empowering confident communication in English-speaking environments."}
            </p>
          </div>

          <div
            className={cn(
              "w-full",
              "opacity-0 translate-y-10",
              active &&
                " animate-show-hero-card-content fill-mode-forwards delay-800",
            )}
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
          </div>
        </MaxWidthWrapper>
      </div>
    );
  },
);

HeroCard.displayName = "HeroCard";
