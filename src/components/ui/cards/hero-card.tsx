"use client";
import { type Transition, type Variants, motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeviceOnly } from "@/components/ui/device-only/device-only";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { HeroImage } from "@/components/ui/hero-image";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { cn } from "@/lib/utils";

type HeroCardProps = {
  index: number;
};

const MotionButton = motion(Button);

export const HeroCard = React.forwardRef<HTMLDivElement, HeroCardProps>(
  ({ index }, ref) => {
    const { deviceType } = useDeviceType();

    const containerVariants: Variants = {
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
        y: "50%",
      },
      animate: {
        opacity: 1,
        y: 0,
      },
    };

    const titleVariants: Variants = {
      exit: ({ isMobile }) => ({
        ...contentVariants.initial,
        transition: { ...transitionAnimation, delay: isMobile ? 0.15 : 0.25 },
      }),
      animate: {
        ...contentVariants.animate,
        transition: {
          ...transitionAnimation,
          delay: 1,
        },
      },
    };
    const subtitleVariants: Variants = {
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
      exit: {
        ...contentVariants.initial,
        transition: { ...transitionAnimation, delay: 0.05 },
      },
      animate: ({ isMobile }) => ({
        ...contentVariants.animate,
        transition: {
          ...transitionAnimation,
          delay: isMobile ? 1.1 : 1.2,
        },
      }),
    };

    const buttonTwoVariants: Variants = {
      exit: {
        ...contentVariants.initial,
        transition: { ...transitionAnimation, delay: 0 },
      },
      animate: ({ isMobile }) => ({
        ...contentVariants.animate,
        transition: {
          transitionAnimation,
          delay: isMobile ? 1.15 : 1.25,
        },
      }),
    };

    return (
      <motion.div
        ref={ref}
        className={cn("absolute left-0 top-0 z-0 flex h-full w-full")}
        variants={containerVariants}
        initial="exit"
        animate="animate"
        exit="exit"
      >
        <HeroImage
          src={
            index % 2 === 0
              ? "/images/hero-background.png"
              : "/images/hero-thumbnail-2.jpg"
          }
          alt="Hero background image"
          containerClassname="max-h-[100vh] sm:h-[140%]"
          shadowClassname="sm:to-10%"
        />
        <MaxWidthWrapper className="relative z-30 mx-0 flex  h-full  flex-col justify-end  gap-4  sm:-mt-8 sm:w-3/4 md:-mt-16 lg:max-w-[56ch] 2xl:max-w-[64ch]">
          <motion.h1
            className="text-left font-sans text-2xl font-semibold leading-tight  tracking-tighter xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl"
            variants={titleVariants}
            custom={{
              isMobile: deviceType === "mobile",
            }}
          >
            English around the world
          </motion.h1>
          <div className="space-y-8">
            <DeviceOnly allowedDevices={["tablet", "desktop"]}>
              <motion.p
                className="w-full text-left text-sm text-gray-800 sm:text-base lg:text-lg"
                variants={subtitleVariants}
              >
                {index % 2 === 0
                  ? "Ideal for beginners to intermediate learners, this course provides comprehensive coverage of grammar essentials through interactive lessons and quizzes, boosting both written and spoken communication skills."
                  : "Tailored for advanced learners, this course focuses on real-life scenarios, idiomatic expressions, and nuanced vocabulary to enhance conversational fluency through role-plays and discussions, empowering confident communication in English-speaking environments."}
              </motion.p>
            </DeviceOnly>
            <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
              <DeviceOnly allowedDevices={["tablet", "desktop"]}>
                <MotionButton
                  variants={buttonOneVariants}
                  variant="default"
                  size="lg"
                  className="w-fit"
                  custom={{ isMobile: deviceType === "mobile" }}
                  asChild
                >
                  <Link href={"/program/slug/id"}>
                    <Play size={22} className="mr-2 fill-current" />
                    Reproduce
                  </Link>
                </MotionButton>
                <MotionButton
                  variants={buttonTwoVariants}
                  variant="outline"
                  size="lg"
                  className="w-fit"
                  custom={{ isMobile: deviceType === "mobile" }}
                  asChild
                >
                  <Link href={"/series/id"}>
                    <Info size={22} className="mr-2" />
                    More information
                  </Link>
                </MotionButton>
              </DeviceOnly>
              <DeviceOnly allowedDevices={["mobile"]}>
                <MotionButton
                  variants={buttonOneVariants}
                  variant="default"
                  size="sm"
                  className="w-full text-sm sm:text-base"
                  custom={{ isMobile: deviceType === "mobile" }}
                  asChild
                >
                  <Link href={"/series/id"}>
                    <Play size={22} className="mr-2 fill-current" />
                    Reproduce
                  </Link>
                </MotionButton>
                <MotionButton
                  variants={buttonTwoVariants}
                  variant="outline"
                  size="sm"
                  className="w-full text-sm sm:text-base"
                  custom={{ isMobile: deviceType === "mobile" }}
                  asChild
                >
                  <Link href={"/series/id"}>
                    <Info size={22} className="mr-2" />
                    More information
                  </Link>
                </MotionButton>
              </DeviceOnly>
            </div>
          </div>
        </MaxWidthWrapper>
      </motion.div>
    );
  },
);

HeroCard.displayName = "HeroCard";
