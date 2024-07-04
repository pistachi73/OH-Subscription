"use client";
import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeroImage } from "@/components/ui/hero-image";
import {
  HeartOutlineIcon,
  InfoOutlineIcon,
  PlayIcon,
} from "@/components/ui/icons";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import { cn, getImageUrl } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";

type HeroCardProps = {
  className?: string;
  program?: Pick<
    RouterOutputs["program"]["getProgramsForCards"][0],
    "title" | "slug" | "description" | "thumbnail"
  >;
  notFound?: boolean;
  index?: number;
  active?: boolean;
};

export const heroCardHeightProps =
  "h-[70vw] landscape:max-h-[80vh] sm:landscape:max-h-[65vh] sm:min-h-[500px] xs:h-[65vw] sm:h-[60vw]";

export const HeroCard = React.forwardRef<HTMLDivElement, HeroCardProps>(
  ({ className, index, program, notFound = false, active = false }, ref) => {
    const { title, slug, description, thumbnail } = program ?? {};

    return (
      <div
        ref={ref}
        className={cn(
          heroCardHeightProps,
          className,
          "transition-opacity duration-500 ease-in-out",
          active ? "opacity-100 z-10 " : "opacity-0 ",
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 -z-10 flex aspect-video w-full h-[calc(100%+4rem)]  sm:h-[calc(100%+8rem)]",
          )}
        >
          <HeroImage
            src={
              notFound
                ? "/images/program-not-found.jpg"
                : thumbnail
                  ? getImageUrl(thumbnail)
                  : index ?? 0 % 2 === 0
                    ? "/images/hero-thumbnail-2.jpg"
                    : "/images/hero-background.png"
            }
            alt="Hero background image"
            containerClassname="h-full"
            shadowClassname="to-20% sm:to-10%"
          />
        </div>

        <MaxWidthWrapper
          className={cn(
            "mb-6 sm:mb-0 absolute bottom-0 sm:bottom-8 left-0 z-30 mx-0 flex flex-col justify-end gap-5",
            "sm:max-w-[45ch]",
            "md:max-w-[56ch]",
            "xl:max-w-[64ch]",
            "2xl:max-w-[72ch]",
          )}
        >
          <div className="space-y-1 sm:space-y-3 lg:space-y-5">
            <h1
              className={cn(
                "text-balance text-left text-xl font-bold tracking-tighter text-foreground capitalize  max-w-[90%]",
                "sm:text-4xl",
                "lg:text-5xl",
                "2xl:text-6xl",
                "opacity-0 translate-y-10",
                active &&
                  " animate-show-hero-card-content fill-mode-forwards delay-600",
              )}
            >
              {title ? title : "Advanced English Conversation"}
            </h1>
            <p
              className={cn(
                "mb-2 line-clamp-3 w-full text-left text-base text-foreground",
                "sm:line-clamp-4 sm:text-base",
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

          {!notFound && (
            <div
              className={cn(
                "flex w-full flex-row items-center gap-8  sm:mt-4 ",
                "opacity-0 translate-y-10",
                active &&
                  " animate-show-hero-card-content fill-mode-forwards delay-800",
              )}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <Button
                  variant="default"
                  className="rounded-full w-14 h-14 md:w-20 md:h-20 p-0 flex items-center justify-center"
                  asChild
                >
                  <Link href={`/programs/${slug}`}>
                    <PlayIcon className="ml-0.5 md:w-9 md:h-9 w-6 h-6" />
                  </Link>
                </Button>
                <p className="font-semibold tracking-tight text-lg md:text-xl text-muted-foreground">
                  Play
                </p>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <ResponsiveTooltip>
                  <ResponsiveTooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0 hover:bg-primary"
                    >
                      <HeartOutlineIcon className="w-5 h-5 md:w-7 md:h-7" />
                    </Button>
                  </ResponsiveTooltipTrigger>
                  <ResponsiveTooltipContent
                    sideOffset={8}
                    side="bottom"
                    className="p-2 px-3"
                  >
                    <p className="text-lg font-medium text-foreground">
                      Add to favorites
                    </p>
                  </ResponsiveTooltipContent>
                </ResponsiveTooltip>

                <ResponsiveTooltip>
                  <ResponsiveTooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0 border-none bg-accent"
                      asChild
                    >
                      <Link href={`/programs/${slug}`}>
                        <InfoOutlineIcon className="w-5 h-5 md:w-7 md:h-7" />
                      </Link>
                    </Button>
                  </ResponsiveTooltipTrigger>
                  <ResponsiveTooltipContent
                    sideOffset={8}
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
          )}
        </MaxWidthWrapper>
      </div>
    );
  },
);

HeroCard.displayName = "HeroCard";
