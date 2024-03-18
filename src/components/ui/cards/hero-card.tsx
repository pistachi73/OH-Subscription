"use client";
import { type Transition, type Variants, motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import React from "react";

import Image from "next/image";

import { MaxWidthWrapper } from "../../max-width-wrapper";

import { Button } from "@/components/ui/button";
import { DeviceOnly } from "@/components/ui/device-only/device-only";
import { cn } from "@/lib/utils";

type HeroCardProps = {
  index: number;
};

const MotionButton = motion(Button);

const containerVariants: Variants = {
  initial: {
    zIndex: 1,
    opacity: 0,
  },
  animate: {
    zIndex: 1,
    opacity: 1,
  },
  exit: {
    zIndex: 2,
    opacity: 0,
    transition: {
      delay: 0.45,
      duration: 1,
      zIndex: {
        delay: 0,
      },
    },
  },
};

const transitionAnimation: Transition = {
  ease: "easeOut",
  duration: 0.2,
};

const contentVariants = {
  initial: {
    opacity: 0,
    y: "100%",
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const titleVariants: Variants = {
  initial: {
    ...contentVariants.initial,
    transition: { ...transitionAnimation, delay: 0.25 },
  },
  exit: {
    ...contentVariants.initial,
    transition: { ...transitionAnimation, delay: 0.25 },
  },
  animate: {
    ...contentVariants.animate,
    transition: {
      ...transitionAnimation,
      delay: 1,
    },
  },
};
const subtitleVariants: Variants = {
  initial: {
    ...contentVariants.initial,
    transition: { ...transitionAnimation, delay: 0.15 },
  },
  exit: {
    ...contentVariants.initial,
    transition: { ...transitionAnimation, delay: 0.15 },
  },
  animate: {
    ...contentVariants.animate,
    transition: {
      ...transitionAnimation,
      delay: 1.1,
    },
  },
};
const buttonOneVariants: Variants = {
  initial: {
    ...contentVariants.initial,
    transition: { ...transitionAnimation, delay: 0.05 },
  },
  exit: {
    ...contentVariants.initial,
    transition: { ...transitionAnimation, delay: 0.05 },
  },
  animate: {
    ...contentVariants.animate,
    transition: {
      ...transitionAnimation,
      delay: 1.2,
    },
  },
};

const buttonTwoVariants: Variants = {
  initial: {
    ...contentVariants.initial,
    transition: { ...transitionAnimation, delay: 0 },
  },
  exit: {
    ...contentVariants.initial,
    transition: { ...transitionAnimation, delay: 0 },
  },
  animate: {
    ...contentVariants.animate,
    transition: {
      transitionAnimation,
      delay: 1.25,
    },
  },
};

export const HeroCard = React.forwardRef<HTMLDivElement, HeroCardProps>(
  ({ index }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "absolute left-0 top-0 z-0 flex h-full w-full",
          "aspect-video lg:aspect-[10/4]",
        )}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div
          className={` absolute left-0 top-0 z-20 h-[130%] w-full  bg-gradient-to-r  from-white from-30% to-transparent to-70% md:from-20% md:to-50% `}
        />
        <div className="absolute left-0 top-0 h-[130%] w-full">
          <Image
            src={
              index % 2 === 0
                ? "/images/hero-background.png"
                : "/images/hero-thumbnail-2.jpg"
            }
            alt="Hero background image"
            fill
            className="absolute left-0 top-0 -z-10 w-full bg-right object-cover"
            priority
          />
        </div>

        <MaxWidthWrapper className="relative z-30 mx-0 flex h-full w-3/4  max-w-[300px] flex-col justify-center gap-4 md:max-w-[550px]  md:gap-4">
          <div className="overflow-hidden">
            <motion.h1
              className="text-left font-sans text-2xl font-semibold leading-tight tracking-tighter md:text-4xl 2xl:text-6xl"
              variants={titleVariants}
            >
              English around the world {index}
            </motion.h1>
          </div>
          <div className="w-3/4 space-y-8">
            <DeviceOnly allowedDevices={["tablet", "desktop"]}>
              <div className="overflow-hidden">
                <motion.p
                  className="w-full text-left text-xs text-gray-800 md:text-sm 2xl:text-base"
                  variants={subtitleVariants}
                >
                  {index % 2 === 0
                    ? "Ideal for beginners to intermediate learners, this course provides comprehensive coverage of grammar essentials through interactive lessons and quizzes, boosting both written and spoken communication skills."
                    : "Tailored for advanced learners, this course focuses on real-life scenarios, idiomatic expressions, and nuanced vocabulary to enhance conversational fluency through role-plays and discussions, empowering confident communication in English-speaking environments."}
                </motion.p>
              </div>
            </DeviceOnly>
            <motion.div
              className="flex flex-row items-center gap-2 overflow-y-clip"
              transition={{ delay: 1, staggerChildren: 0.1 }}
            >
              <DeviceOnly allowedDevices={["tablet", "desktop"]}>
                <MotionButton
                  variants={buttonOneVariants}
                  variant="default"
                  size="lg"
                  className="w-fit"
                >
                  <Play size={22} className="mr-2 fill-current" />
                  Reproduce
                </MotionButton>
                <MotionButton
                  variants={buttonTwoVariants}
                  variant="ghost"
                  size="lg"
                  className="w-fit"
                >
                  <Info size={22} className="mr-2" />
                  More information
                </MotionButton>
              </DeviceOnly>
              <DeviceOnly allowedDevices={["mobile"]}>
                <MotionButton
                  variants={buttonOneVariants}
                  variant="default"
                  size="sm"
                  className="w-fit"
                >
                  <Play size={18} className="mr-2 fill-current" />
                  Reproduce
                </MotionButton>
                <MotionButton
                  variants={buttonTwoVariants}
                  variant="ghost"
                  size="sm"
                  className="w-9 px-0"
                >
                  <Info size={18} className="" />
                </MotionButton>
              </DeviceOnly>
            </motion.div>
          </div>
        </MaxWidthWrapper>
      </motion.div>
    );
  },
);

HeroCard.displayName = "HeroCard";
