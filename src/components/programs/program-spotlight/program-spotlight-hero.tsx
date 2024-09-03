"use client";

import { CalendarClock } from "lucide-react";

import { HeroImage } from "../../ui/hero-image";
import { MaxWidthWrapper } from "../../ui/max-width-wrapper";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { LayersIcon, ShareOutlineIcon } from "@/components/ui/icons";
import {
  LikeButton,
  LikeButtonIcon,
  LikeButtonLabel,
} from "@/components/ui/like-button";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import { ShareButton } from "@/components/ui/share-button/share-button";
import { SubscribedBanner } from "@/components/ui/subscribed-banner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import { getUrl } from "@/lib/utils/get-url";
import { format } from "date-fns";
import { ProgramMainCTAButton } from "../program-play-button";

import { useLikeSource } from "@/hooks/use-like-source";
import type { ProgramSpotlightSchema } from "@/server/api/types";

type ProgramSpotlightHero = {
  program: NonNullable<ProgramSpotlightSchema>;
};

export const ProgramSpotlightHero = ({ program }: ProgramSpotlightHero) => {
  const { isLikedByUser, isLikeLoading, like } = useLikeSource({
    initialLiked: program.isLikedByUser,
  });

  const {
    title,
    description,
    categories,
    totalChapters,
    updatedAt,
    thumbnail,
  } = program;

  return (
    <MaxWidthWrapper
      className={cn(
        "relative overflow-hidden",
        "portrait:min-h-[auto]",
        "landscape:flex landscape:flex-end landscape:min-h-[70vh]",
      )}
    >
      <div className="absolute -bottom-px left-0 -z-10 h-[calc(100%+1px)] w-full bg-gradient-to-t from-muted-background to-25%" />
      <HeroImage
        src={thumbnail}
        fallbackSrc="/images/hero-thumbnail-2.jpg"
        priority
        alt="Program Spotlight Hero Image"
        containerClassname="-z-20 max-h-[100%]"
      />
      <div
        className={cn(
          "flex flex-col grow relative justify-end gap-3 lg:gap-5",
          "mt-8 sm:mt-[calc(120px)]",
          "portrait:before:top-0 portrait:before:h-[35vw] sm:portrait:before:h-[25vw] portrait:before:min-h-[100px] portrait:before:content-['']",
          "landscape:mt-[calc(100vw*9/16-48px)] landscape:sm:mt-[calc(120px)]",
        )}
      >
        <div
          className={cn(
            "space-y-2 sm:space-y-3 lg:space-y-5",
            "lg:max-w-[56ch]",
            "xl:max-w-[64ch]",
            "2xl:max-w-[72ch]",
          )}
        >
          <h1
            className={cn(
              "text-left text-2xl font-bold leading-tight  tracking-tighter  text-balance font-sans",
              "sm:text-4xl",
              "lg:text-5xl",
              "2xl:text-6xl",
            )}
          >
            {title}
          </h1>

          <p className="w-full text-left  text-base sm:text-lg">
            {description}
          </p>
        </div>

        <div className="flex flex-row gap-2 text-muted-foreground text-base sm:text-lg touch-pan-x shrink-0 overflow-x-scroll no-scrollbar">
          {updatedAt && (
            <p className="flex flex-row items-center gap-1 shrink-0">
              <CalendarClock size={18} />
              Last update: {format(updatedAt, "MMM yyyy")}
            </p>
          )}
          <p className="mx-2 flex flex-row items-center gap-1 shrink-0">
            <LayersIcon className="w-5 h-5" />
            {totalChapters} chapters
          </p>
          {categories?.map((category) => (
            <Badge
              key={`category-${category.name}`}
              variant="accent"
              className="text-xs sm:text-sm"
            >
              {category.name}
            </Badge>
          ))}
        </div>

        <section className="hidden md:block w-full">
          <SubscribedBanner className="text-base mb-3">
            Auto-renews at €4.99/month after trial
          </SubscribedBanner>
          <div className="flex items-center gap-8">
            <ProgramMainCTAButton
              program={program}
              navigationMode="auth"
              size="hero"
            />

            <div className="flex items-center gap-2">
              <ResponsiveTooltip>
                <ResponsiveTooltipTrigger asChild>
                  <LikeButton
                    variant="accent"
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0"
                    isLikedByUser={isLikedByUser ?? false}
                    isLikeLoading={isLikeLoading}
                    like={() => like({ programId: program.id })}
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

              <ShareButton
                title="Share this program"
                description="Share this program with your friends and family."
                videoTitle={title}
                videoThumbnailUrl="/images/hero-thumbnail-2.jpg"
                url={getUrl(`/programs/${program.slug}`)}
                config={{
                  link: true,
                  facebook: true,
                  twitter: { title, hashtags: "" },
                  linkedin: true,
                  email: {
                    subject: title,
                    body: description,
                  },
                }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={cn(
                        buttonVariants({ variant: "accent" }),
                        "w-14 h-14 rounded-full p-0",
                      )}
                    >
                      <ShareOutlineIcon className="w-7 h-7" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={12}
                    side="bottom"
                    className="p-2 px-3"
                  >
                    <p className="text-lg font-medium text-foreground">Share</p>
                  </TooltipContent>
                </Tooltip>
              </ShareButton>
            </div>
          </div>
        </section>

        <section className="flex md:hidden w-full flex-col gap-2 overflow-y-clip mt-2 overflow-visible">
          <SubscribedBanner className="text-sm">
            Auto-renews at €4.99/month after trial
          </SubscribedBanner>
          <ProgramMainCTAButton
            program={program}
            navigationMode="auth"
            size="hero"
            className="w-full text-base min-h-12"
          />
          <div className="flex gap-2 w-full ">
            <ShareButton
              asChild
              title="Share this program"
              description="Share this program with your friends and family."
              videoTitle={title}
              videoThumbnailUrl="/images/hero-thumbnail-2.jpg"
              url={getUrl(`/programs/${program.slug}`)}
              config={{
                link: true,
                facebook: true,
                twitter: { title, hashtags: "" },
                linkedin: true,
                email: {
                  subject: title,
                  body: description,
                },
              }}
            >
              <Button
                variant="accent"
                size="lg"
                className="w-full text-base h-12"
              >
                <ShareOutlineIcon className="mr-2 w-6 h-6" />
                Share
              </Button>
            </ShareButton>
            <LikeButton
              variant="accent"
              size="lg"
              className="w-full text-base h-12 disabled:opacity-100"
              isLikedByUser={isLikedByUser ?? false}
              isLikeLoading={isLikeLoading}
              like={() => like({ programId: program.id })}
            >
              <LikeButtonIcon className="mr-2 w-6 h-6" />
              <LikeButtonLabel
                className="text-base text-foreground"
                likedLabel="Liked"
                unlikedLabel="Like"
              />
            </LikeButton>
          </div>
        </section>
      </div>
    </MaxWidthWrapper>
  );
};
