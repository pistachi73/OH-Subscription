"use client";

import {
  AnimatePresence,
  type Variants,
  cubicBezier,
  motion,
} from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeviceOnly } from "@/components/ui/device-only/device-only";

const MotionButton = motion(Button);
const MotionLink = motion(Link);

export const Chapter = () => {
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

  //   const ease = cubicBezier(0.15, 0.8, 0.6, 1);
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
          className="cursor-pointer rounded-lg bg-slate-200"
          whileHover="hover"
          layout="position"
          initial={false}
          animate="initial"
          variants={containerVariants}
          onClick={() => setIsMobileChapterOpen(!isMobileChapterOpen)}
        >
          <div className="p-4">
            <div className="flex flex-row items-center gap-3">
              <MotionButton
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-gray-800 bg-primary-50/70"
                variant="outline"
                size="icon"
              >
                <Play
                  className="ml-1 fill-gray-800 stroke-gray-800"
                  size={24}
                />
              </MotionButton>

              <div className="space-y-1">
                <p className="text-base font-semibold tracking-tight">
                  Episode 1 - Unlocking vocabulary
                </p>
                <p className="xs:text-b text-xs  text-gray-600">
                  February 25, 2025 <span className="ml-3">14 min</span>
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
                    className="mt-4 space-y-4"
                    variants={mobileContentVariants}
                  >
                    <MotionLink
                      href="/"
                      className="relative block aspect-video w-full max-w-[400px]"
                    >
                      <Image
                        src="/images/video-thumbnail.png"
                        alt="video"
                        fill
                        className="rounded-sm"
                      />
                    </MotionLink>
                    <motion.p className="text-sm text-gray-600">
                      Vocabulary is the cornerstone of effective communication.
                      In this chapter, students embark on a journey to expand
                      their lexicon, exploring strategies for learning new
                      words, deciphering meanings from context, and mastering
                      techniques for retention and application in both spoken
                      and written language. Vocabulary is the cornerstone of
                      effective communication.
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* <div className="grid h-full w-full  grid-cols-2">
            <Link href="/" className="relative block aspect-video">
              <Image
                src="/images/video-thumbnail.png"
                alt="video"
                fill
                className="rounded-sm"
              />
              <MotionButton
                className="absolute left-1/2 top-1/2 flex h-12 w-12 items-center justify-center rounded-full border-gray-800 bg-primary-50/70"
                variant="outline"
                size="icon"
                variants={imageVariants}
              >
                <Play className="fill-gray-800 stroke-gray-800" size={24} />
              </MotionButton>
            </Link>
            <DeviceOnly allowedDevices={["mobile"]}>hello</DeviceOnly>
          </div>
          <div className="max-w-[72ch] space-y-1">
            <p className="text-lg font-semibold tracking-tight">
              Episode 1 - Unlocking vocabulary
            </p>
            <p className="text-sm text-gray-600">
              February 25, 2025 <span className="ml-3">14 min</span>
            </p>
            <p className="text-base text-gray-600">
              Vocabulary is the cornerstone of effective communication. In this
              chapter, students embark on a journey to expand their lexicon,
              exploring strategies for learning new words, deciphering meanings
              from context, and mastering techniques for retention and
              application in both spoken and written language. Vocabulary is the
              cornerstone of effective communication.
            </p>
          </div>*/}
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
            <Link href="/" className="relative block aspect-video">
              <Image
                src="/images/video-thumbnail.png"
                alt="video"
                fill
                className="rounded-sm"
              />
              <MotionButton
                className="absolute left-1/2 top-1/2 flex h-12 w-12 items-center justify-center rounded-full border-gray-800 bg-primary-50/70"
                variant="outline"
                size="icon"
                variants={imageVariants}
              >
                <Play
                  className="ml-1 fill-gray-800 stroke-gray-800"
                  size={24}
                />
              </MotionButton>
            </Link>
            <DeviceOnly allowedDevices={["mobile"]}>hello</DeviceOnly>
          </div>
          <div className="max-w-[72ch] space-y-1">
            <p className="text-lg font-semibold tracking-tight">
              Episode 1 - Unlocking vocabulary
            </p>
            <p className="text-sm text-gray-600">
              February 25, 2025 <span className="ml-3">14 min</span>
            </p>
            <p className="line-clamp-5 text-base text-gray-600">
              Vocabulary is the cornerstone of effective communication. In this
              chapter, students embark on a journey to expand their lexicon,
              exploring strategies for learning new words, deciphering meanings
              from context, and mastering techniques for retention and
              application in both spoken and written language. Vocabulary is the
              cornerstone of effective communication.
            </p>
          </div>
        </motion.div>
      </DeviceOnly>
    </>
  );
};
