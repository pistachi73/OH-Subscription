"use client";

import MuxPlayer from "@mux/mux-player-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarFold,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Share,
  User,
} from "lucide-react";
import { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ChapterPlayList } from "./chapter-playlist";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CardList } from "@/components/ui/cards/card-list";
import { Community } from "@/components/ui/community/community";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { ShareButton } from "@/components/ui/share-button/share-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toSentenceCase } from "@/lib/case-converters";
import { cn } from "@/lib/utils";

export const Chapter = () => {
  const params = useParams<{
    programSlug: string;
    programId: string;
    chapterSlug: string;
    chapterId: string;
  }>();

  const [showPlaylist, setShowPlaylist] = useState(true);

  const { deviceType, deviceSize } = useDeviceType();

  return (
    <MaxWidthWrapper className={cn("mt-4 max-w-[1400px]", "lg:mt-6")}>
      <div
        className={cn(
          "mb-4 flex w-full flex-col justify-between gap-3",
          "sm:flex-row sm:items-center",
        )}
      >
        <Breadcrumb className="flex">
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
                <Link
                  href={`/program/${params.programSlug}/${params.programId}`}
                >
                  {toSentenceCase(params.programSlug)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>
                Episode 1: {toSentenceCase(params.chapterSlug)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
            variant="secondary"
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
                <ChapterPlayList />
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
          Episode 1 - Unlocking Vocabulary
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
            url="https://www.smarteditor.app"
            title="Share this chapter"
            description={
              <span>
                Check out this chapter from the program English around the world
              </span>
            }
            videoTitle="Unlocking vocabulary learning Unlocking vocabulary learningg"
            videoThumbnailUrl="/images/hero-thumbnail-2.jpg"
            config={{
              linkedin: true,
              facebook: true,
              link: true,
              twitter: {
                title: "Unlocking vocabulary learning",
                hashtags: "vocabulary, learning",
              },
              email: {
                email: "gelo",
                subject: "Check out this chapter",
                body: "I thought you might be interested in this chapter I found.",
              },
            }}
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
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex flex-row items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-muted">
                      <User className="text-muted-foreground" size={12} />
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs sm:text-sm">Jhon Doe</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-foreground sm:text-base">
              Vocabulary is the cornerstone of effective communication. In this
              chapter, students embark on a journey to expand their lexicon,
              exploring strategies for learning new words, deciphering meanings
              from context, and mastering techniques for retention and
              application in both spoken and written language.
            </p>
            <div className=" flex flex-row gap-1">
              <p className="rounded-sm  bg-gray-800 px-[6px] py-1 text-xs text-white md:text-sm">
                Grammar
              </p>
              <p className="rounded-sm  bg-gray-800 px-[6px] py-1 text-xs text-white md:text-sm">
                Vocabulary
              </p>
              <p className="rounded-sm  bg-gray-800 px-[6px] py-1 text-xs text-white md:text-sm">
                Quizz
              </p>
            </div>
          </div>
          <Tabs defaultValue="community" className="w-full">
            <TabsList className="flex w-full items-center justify-center lg:mb-7 ">
              <TabsTrigger value="community" className="text-sm!">
                Community
              </TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
            <TabsContent value="transcript">
              <div className="rounded-md bg-accent/50 p-4">
                <p className="text-sm sm:text-base">transcript</p>
              </div>
            </TabsContent>

            <TabsContent value="community">
              <Community />
            </TabsContent>
          </Tabs>
        </div>
        <div className="mt-16 space-y-4">
          <h2 className="text-xl font-medium tracking-tight">
            Related programs
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            <CardList
              cardsPerRow={{
                xs: 1,
                md: 2,
                lg: 1,
              }}
            />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
