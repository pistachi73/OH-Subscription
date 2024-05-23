"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeviceOnly } from "@/components/ui/device-only/device-only";
import type { ProgramSpotlight } from "@/server/db/schema.types";
import { format } from "date-fns";

const MotionButton = motion(Button);
const MotionLink = motion(Link);

type ChapterProps = {
  chapter: NonNullable<ProgramSpotlight>["chapters"][0];
};

export const Chapter = ({ chapter }: ChapterProps) => {
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

              <div className="flex flex-col">
                <p className="text-base font-medium">Episode {chapterNumber}</p>
                <p className="text-base font-medium text-muted-foreground">
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
                    className="mt-4 flex flex-col xs:flex-row gap-4"
                    variants={mobileContentVariants}
                  >
                    <div
                      className="relative block aspect-video w-full basis-full xs:basis-36 shrink-0"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Image
                        src="/images/video-thumbnail.png"
                        alt="video"
                        fill
                        className="rounded-sm object-cover"
                      />
                    </div>
                    <div className="overflow-hidden space-y-1">
                      <p className="xs:text-b text-sm  text-muted-foreground">
                        {updatedAt && format(updatedAt, "MMM dd, yyyy")}{" "}
                        <span className="ml-3">{duration} min</span>
                      </p>
                      <motion.p className="text-base text-foreground line-clamp-2">
                        {description}
                      </motion.p>
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
