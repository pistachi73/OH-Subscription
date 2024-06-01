"use client";

import MuxPlayer from "@mux/mux-player-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarFold,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share,
  User,
} from "lucide-react";
import { useState } from "react";

import { ChapterPlayList } from "./chapter-playlist";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { ShareButton } from "@/components/ui/share-button/share-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBaseUrl } from "@/lib/get-url";
import { cn } from "@/lib/utils";
import type {
  ProgramChapter,
  ProgramSpotlight,
} from "@/server/db/schema.types";
import { Badge } from "../ui/badge";
import { ChapterCommunity } from "./chapter-community";
import { ChapterRelated } from "./chapter-related";

type ChapterProps = {
  program: NonNullable<ProgramSpotlight>;
  chapter: NonNullable<ProgramChapter>;
};

export const Chapter = ({ chapter, program }: ChapterProps) => {
  const [showPlaylist, setShowPlaylist] = useState(true);
  const { deviceType, deviceSize } = useDeviceType();

  return (
    <MaxWidthWrapper className={cn("mt-4 max-w-[1400px]", "lg:mt-8")}>
      <div
        className={cn(
          "mb-4 flex w-full flex-col justify-between gap-3",
          "sm:flex-row sm:items-center",
        )}
      >
        <h1 className="text-2xl font-semibold tracking-tighter lg:text-3xl text-balance">
          {program.title}
        </h1>
        <Button variant="ghost">Back to program</Button>
        {/* <Breadcrumb className="flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home size={14} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/programs/${program.slug}`}>
                  {toSentenceCase(program.slug)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>
                Episode {chapter.chapterNumber}: {toSentenceCase(chapter.slug)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
      </div>
      <div
        className={clsx(
          "relative grid w-full  grid-cols-1 grid-rows-[1fr,300px] overflow-hidden transition-all duration-200 ease-out md:grid-rows-1",
          {
            "delay-500 md:grid-cols-[1fr,0px]": !showPlaylist,
            "md:grid-cols-[1fr,310px]": showPlaylist,
          },
        )}
      >
        <div
          className={cn(
            "group relative z-10 aspect-video overflow-hidden rounded-t-sm",
            "md:mr-2 md:rounded-sm",
          )}
        >
          <MuxPlayer
            className="w-full"
            streamType="on-demand"
            playbackId="CeGfBtZvePRisBwtvQiXKfLNloBQ1RY8NhAJlSZ5ieI"
            metadataVideoTitle="Placeholder (optional)"
            metadataViewerUserId="Placeholder (optional)"
            primaryColor="#FFFFFF"
            secondaryColor="#000000"
            style={{ aspectRatio: 16 / 9 }}
          />
          <Button
            className={cn(
              "absolute right-2 top-2 hidden h-8 w-8 bg-opacity-50 p-0 opacity-0 transition-opacity",
              "md:flex",
              "hover:bg-opacity-100 group-hover:opacity-100",
            )}
            variant="accent"
            size="icon"
            onClick={() => setShowPlaylist(!showPlaylist)}
          >
            {showPlaylist ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </Button>
        </div>
        <AnimatePresence initial={false}>
          {(showPlaylist || deviceType === "mobile") && (
            <motion.div
              className="relative w-full"
              initial={{ opacity: 0, x: 10 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.4,
                },
              }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="absolute right-0 top-0 z-0 h-full w-full  min-w-[310px]">
                <ChapterPlayList
                  program={program}
                  currentChapter={chapter.chapterNumber ?? 0}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div
        className={cn(
          "mt-4 flex flex-col justify-between gap-3",
          "lg:flex-row lg:items-center",
        )}
      >
        <h2 className="text-lg font-medium tracking-tight lg:text-xl">
          Episode {chapter.chapterNumber} - {chapter.title}
        </h2>
        <div className="flex flex-row flex-wrap gap-2">
          <Button
            variant="outline"
            size={deviceSize.includes("lg") ? "default" : "sm"}
          >
            <CalendarFold size={18} className="mr-2" />
            Add to calendar
          </Button>

          <Button
            variant="outline"
            size={deviceSize.includes("lg") ? "default" : "sm"}
          >
            <Heart size={18} className="mr-2" />
            Add to favorites
          </Button>
          <ShareButton
            url={`${getBaseUrl()}/programs/${program.slug}/chapters/${
              chapter.slug
            }`}
            title="Share this chapter"
            description={
              <span>
                Check out this chapter from the program{" "}
                <b>English around the world</b>
              </span>
            }
            videoTitle={chapter.title}
            videoThumbnailUrl={
              chapter.thumbnail ?? "/images/hero-thumbnail-2.jpg"
            }
            config={{
              linkedin: true,
              facebook: true,
              link: true,
              twitter: {
                title: chapter.title,
                hashtags: program.categories
                  ?.map((category) => category.name)
                  .join(","),
              },
              email: {
                subject: `Check out this chapter from ${program.title}`,
                body: "I thought you might be interested in this chapter I found.",
              },
            }}
            asChild
          >
            <Button
              variant="outline"
              size={deviceSize.includes("lg") ? "default" : "sm"}
            >
              <Share size={18} className="mr-2" />
              Share
            </Button>
          </ShareButton>
        </div>
      </div>
      <div
        className={cn(
          "mt-3 grid grid-rows-2 gap-16",
          "lg:mt-2 lg:grid-cols-[1fr,310px] lg:grid-rows-1",
        )}
      >
        <div className="w-full space-y-8 lg:space-y-12">
          <div className="space-y-3">
            <div className="flex flex-row gap-4">
              {program.teachers?.map((teacher, index) => (
                <div
                  key={teacher.name}
                  className="flex flex-row items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={teacher.image ?? undefined} />
                    <AvatarFallback className="bg-muted">
                      <User className="text-muted-foreground" size={12} />
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs sm:text-sm">{teacher.name}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-foreground sm:text-base">
              {chapter.description}
            </p>
            {program.categories && (
              <div className=" flex flex-row gap-1">
                {program.categories.map((category) => (
                  <Badge
                    key={`category-${category.name}`}
                    variant="accent"
                    className="text-xs sm:text-sm"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Tabs
            defaultValue="community"
            className="w-full"
            layoutId="chapter-tabs"
          >
            <TabsList className="flex w-full items-center justify-center lg:mb-7 ">
              <TabsTrigger value="community" className="text-sm!">
                Community
              </TabsTrigger>
              {chapter.transcript && (
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
              )}
            </TabsList>
            {chapter.transcript && (
              <TabsContent value="transcript">
                <div className="rounded-md bg-accent/50 p-4">
                  <p className="text-sm sm:text-base">{chapter.transcript}</p>
                </div>
              </TabsContent>
            )}

            <TabsContent value="community">
              <ChapterCommunity chapter={chapter} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:mt-16 space-y-4">
          <ChapterRelated program={program} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
