"use client";

import { CalendarClock, Heart, LibraryBig, Play, Share2 } from "lucide-react";

import { HeroImage } from "../../ui/hero-image";
import { MaxWidthWrapper } from "../../ui/max-width-wrapper";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button/share-button";
import { getBaseUrl } from "@/lib/get-url";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";
import { format } from "date-fns";
import Link from "next/link";

type ProgramSpotlightHero = {
  program: NonNullable<RouterOutputs["program"]["getBySlug"]>;
};

export const ProgramSpotlightHero = ({ program }: ProgramSpotlightHero) => {
  const { title, description, categories, totalChapters, chapters, updatedAt } =
    program;

  const firstChapterSlug = chapters?.[0]?.slug;

  return (
    <div className="relative mb-8 max-h-[55vh] w-full sm:mb-0 lg:h-[76vw]">
      <HeroImage
        src="/images/hero-thumbnail-2.jpg"
        alt="testing"
        containerClassname=" max-h-[55vh]"
        shadowClassname="before:bg-transparent lg:before:bg-hero-gradient to-45% sm:to-45% lg:to-35%"
      />

      <MaxWidthWrapper
        className={cn(
          "relative z-30 mx-0 flex h-full flex-col  gap-4",
          "before:top-0 before:h-[45vw] before:min-h-[100px] before:content-[''] lg:justify-end lg:before:content-none",
        )}
      >
        <div
          className={cn(
            " space-y-2 lg:space-y-4 sm:w-3/4",
            "sm:max-w-[45ch]",
            "md:max-w-[56ch]",
            "xl:max-w-[64ch]",
            "2xl:max-w-[72ch]",
          )}
        >
          <h1 className="text-left font-sans text-3xl font-bold leading-tight  tracking-tighter xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl text-balance">
            {title}
          </h1>
          <p className="w-full text-left text-base md:text-lg font-light lg:text-lg text-balance">
            {description}
          </p>
        </div>

        <div className="flex flex-row flex-wrap gap-2 text-muted-foreground   text-base">
          {updatedAt && (
            <p className="flex flex-row items-center gap-1">
              <CalendarClock size={18} />
              Last update: {format(updatedAt, "MMM yyyy")}
            </p>
          )}
          <p className="mx-2 flex flex-row items-center gap-1">
            <LibraryBig size={18} />
            {totalChapters} chapters
          </p>
          {categories.map((category) => (
            <Badge
              key={`category-${category.name}`}
              variant="secondary"
              className="text-sm"
            >
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="flex w-full flex-col items-center gap-2 overflow-y-clip sm:flex-row">
          {firstChapterSlug && (
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-fit text-sm sm:text-base"
              asChild
            >
              <Link href={`chapters/${firstChapterSlug}`}>
                <Play size={22} className="mr-2 fill-current" />
                Reproduce
              </Link>
            </Button>
          )}
          <div className="flex gap-2 w-full ">
            <ShareButton
              asChild
              title="Share this program"
              description="Share this program with your friends and family."
              videoTitle={title}
              videoThumbnailUrl="/images/hero-thumbnail-2.jpg"
              url={`${getBaseUrl()}/programs/${program.slug}`}
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
              <Button variant="outline" size="lg" className="w-full sm:w-fit">
                <Share2 size={22} className="mr-2" />
                Share
              </Button>
            </ShareButton>
            <Button variant="outline" size="lg" className="w-full sm:w-fit">
              <Heart size={22} className="mr-2" />
              Add to favorites
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
