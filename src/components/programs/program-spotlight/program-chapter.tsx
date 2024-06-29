"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeviceOnly } from "@/components/ui/device-only/device-only";
import { PlayIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { ProgramSpotlight } from "@/server/db/schema.types";
import { format } from "date-fns";

const MotionButton = motion(Button);
const MotionLink = motion(Link);

type ChapterProps = {
  chapter: NonNullable<ProgramSpotlight>["chapters"][0];
};

export const ChapterOld = ({ chapter }: ChapterProps) => {
  const { title, description, updatedAt, duration, chapterNumber, slug } =
    chapter;

  const [isMobileChapterOpen, setIsMobileChapterOpen] = useState(false);

  const containerVariants: Variants = {
    initial: {
      x: 0,
    },
    hover: {
      x: 0,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    },
  };
  const imageVariants: Variants = {
    initial: {
      y: "-50%",
      x: "-50%",
      opacity: 0,
    },
    hover: {
      y: "-50%",
      x: "-50%",
      scale: 1.2,
      opacity: 1,
    },
  };

  const ease = cubicBezier(0.23, 1, 0.6, 1);

  const mobileContainerVariants: Variants = {
    initial: { height: 0 },
    animate: {
      height: "auto",
      transition: {
        duration: 0.3,
        ease,
      },
    },
    exit: {
      height: 0,
      transition: {
        duration: 0.3,
        delay: 0.3,
        ease,
      },
    },
  };

  const mobileContentVariants: Variants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.4, duration: 0.2, ease },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease },
    },
  };

  return (
    <>
      <DeviceOnly allowedDevices={["mobile"]}>
        <motion.div
          className="cursor-pointer rounded-lg bg-muted/50"
          whileHover="hover"
          layout="position"
          initial={false}
          animate="initial"
          variants={containerVariants}
          onClick={() => setIsMobileChapterOpen(!isMobileChapterOpen)}
        >
          <div className="p-4">
            <div className="flex flex-row items-center gap-3">
              <Button
                type="button"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-primary bg-muted/50 hover:bg-muted/80"
                variant="outline"
                size="icon"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={`chapters/${slug}`}>
                  <Play
                    className="-ml-px fill-primary stroke-primary"
                    size={24}
                  />
                </Link>
              </Button>

              <div className="flex flex-col gap-px">
                <p className="text-sm font-medium">Episode {chapterNumber}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {title}
                </p>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isMobileChapterOpen && (
                <motion.div
                  className="overflow-hidden"
                  variants={mobileContainerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.div
                    className="mt-4 flex flex-row gap-4"
                    variants={mobileContentVariants}
                  >
                    <div className="w-full h-full basis-24 xs:basis-36 shrink-0">
                      <div
                        className="relative block aspect-video shrink-0 w-full"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <Image
                          src="/images/video-thumbnail.png"
                          alt="video"
                          fill
                          className="rounded-sm object-cover"
                        />
                      </div>
                    </div>
                    <div className="overflow-hidden space-y-1">
                      <p className="xs:text-b text-xs  text-muted-foreground">
                        {updatedAt && format(updatedAt, "MMM dd, yyyy")}{" "}
                        <span className="ml-2 ">{duration} min</span>
                      </p>
                      <p className="text-sm text-foreground line-clamp-3">
                        {description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DeviceOnly>
      <DeviceOnly allowedDevices={["tablet", "desktop"]}>
        <motion.div
          className="group grid gap-4 sm:grid-cols-[1fr,2fr] lg:grid-cols-[1fr,3fr]"
          whileHover="hover"
          initial={false}
          animate="initial"
          variants={containerVariants}
        >
          <div className="h-full w-full">
            <Link
              href={`chapters/${slug}`}
              className="relative block aspect-video"
            >
              <Image
                src="/images/video-thumbnail.png"
                alt="video"
                fill
                className="rounded-sm"
              />
              <MotionButton
                className="absolute left-1/2 top-1/2 flex h-12 w-12 items-center justify-center rounded-full border-primary bg-white/70"
                variant="outline"
                size="icon"
                variants={imageVariants}
              >
                <Play
                  className="-ml-px fill-primary-500 stroke-primary-500"
                  size={24}
                />
              </MotionButton>
            </Link>
          </div>
          <div className="max-w-[72ch] space-y-1">
            <p className="text-lg font-semibold tracking-tight">
              Episode {chapterNumber} - {title}
            </p>
            <p className="text-sm text-muted-foreground">
              {updatedAt && format(updatedAt, "MMM dd, yyyy")}{" "}
              <span className="ml-3">{duration} min</span>
            </p>
            <p className="line-clamp-5 text-base text-foreground">
              {description}
            </p>
          </div>
        </motion.div>
      </DeviceOnly>
    </>
  );
};

export const Chapter = ({ chapter }: ChapterProps) => {
  return (
    <div className="w-full">
      <Link
        href={`chapters/${chapter.slug}`}
        className="group relative block aspect-video w-full  rounded-xl overflow-hidden"
      >
        <Image
          src={chapter.thumbnail ?? "/images/hero-thumbnail-2.jpg"}
          alt="video"
          fill
          className="object-cover"
        />
        <Button
          className={cn(
            "w-16 h-16 rounded-full scale-75 opacity-0 transition-all shrink-0",
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
            "flex items-center justify-center",
            "group-hover:scale-100 group-hover:opacity-100",
          )}
        >
          <PlayIcon className="w-6 h-6" />
        </Button>
      </Link>
      <div className="mt-4 ">
        <p className="text-muted-foreground font-medium tracking-tight text-sm">
          CHAPTER {chapter.chapterNumber}
        </p>
        <h2 className="mt-px line-clamp-1 w-full gap-3 text-foreground text-base md:text-xl font-semibold tracking-tighter">
          {chapter.title}
        </h2>

        <p className="mt-2 text-sm sm:text-base leading-relaxed  text-foreground line-clamp-4">
          {chapter.description}
        </p>
      </div>
    </div>
  );
};
