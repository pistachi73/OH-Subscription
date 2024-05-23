"use client";
import {
  motion,
  usePresence,
  type Transition,
  type Variants,
} from "framer-motion";
import { Info, Play } from "lucide-react";
import React, { useEffect } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { HeroImage } from "@/components/ui/hero-image";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
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
};

const MotionButton = motion(Button);
export const heroCardHeightProps =
  "h-[83vw] landscape:max-h-[55vh] sm:min-h-[450px] xs:h-[72vw] sm:h-[70vw]";

const TRANSITION: Transition = {
  ease: "easeOut",
  duration: 0.1,
};
const IMAGE_ANIMATION_DURATION: number = 0.35;
const DELAY_INCREMENT: number = 0.05;
const SAFE_TO_REMOVE_MS: number =
  (IMAGE_ANIMATION_DURATION + TRANSITION.duration + DELAY_INCREMENT * 3) * 1000;

export const HeroCard = React.forwardRef<HTMLDivElement, HeroCardProps>(
  ({ className, index, program, notFound = false }, ref) => {
    const { isMobile } = useDeviceType();
    const [isPresent, safeToRemove] = usePresence();

    useEffect(() => {
      !isPresent && setTimeout(safeToRemove, SAFE_TO_REMOVE_MS);
    }, [isPresent, safeToRemove]);

    const { title, slug, description, thumbnail } = program ?? {};

    const containerVariants: Variants = {
      animate: {
        zIndex: 1,
        opacity: 1,
      },
      exit: {
        zIndex: 2,
        opacity: 0,
        transition: {
          delay: TRANSITION.duration + DELAY_INCREMENT * 3,
          duration: IMAGE_ANIMATION_DURATION,
          zIndex: {
            delay: 0,
          },
        },
      },
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
      exit: {
        ...contentVariants.initial,
        transition: { ...TRANSITION, delay: DELAY_INCREMENT * 3 },
      },
      animate: {
        ...contentVariants.animate,
        transition: {
          ...TRANSITION,
          delay: IMAGE_ANIMATION_DURATION,
        },
      },
    };
    const subtitleVariants: Variants = {
      exit: {
        ...contentVariants.initial,
        transition: { ...TRANSITION, delay: DELAY_INCREMENT * 2 },
      },
      animate: {
        ...contentVariants.animate,
        transition: {
          ...TRANSITION,
          delay: IMAGE_ANIMATION_DURATION + DELAY_INCREMENT,
        },
      },
    };
    const buttonOneVariants: Variants = {
      exit: {
        ...contentVariants.initial,
        transition: { ...TRANSITION, delay: DELAY_INCREMENT },
      },
      animate: {
        ...contentVariants.animate,
        transition: {
          ...TRANSITION,
          delay: IMAGE_ANIMATION_DURATION + DELAY_INCREMENT * 2,
        },
      },
    };

    const buttonTwoVariants: Variants = {
      exit: {
        ...contentVariants.initial,
        transition: { ...TRANSITION, delay: 0 },
      },
      animate: {
        ...contentVariants.animate,
        transition: {
          ...TRANSITION,
          delay: IMAGE_ANIMATION_DURATION + DELAY_INCREMENT * 3,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(heroCardHeightProps, className)}
        initial="exit"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className={cn(
            "absolute left-0 top-0 -z-10 flex aspect-video w-full sm:h-[135%]",
          )}
          variants={containerVariants}
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
            containerClassname="h-full min-h-[100%]"
            shadowClassname="to-60% sm:to-35%"
          />
        </motion.div>

        <MaxWidthWrapper
          className={cn(
            "absolute bottom-0 left-0 z-30 mx-0 flex flex-col justify-end gap-5",
            "sm:max-w-[45ch]",
            "md:max-w-[56ch]",
            "xl:max-w-[64ch]",
            "2xl:max-w-[72ch]",
          )}
        >
          <div className="space-y-3">
            <motion.h1
              className={cn(
                "text-balance text-left font-sans text-3xl font-bold tracking-tighter",
                "sm:text-4xl",
                "lg:text-5xl",
              )}
              variants={titleVariants}
              custom={{
                isMobile: isMobile,
              }}
            >
              {title ? title : "Advanced English Conversation"}
            </motion.h1>
            <motion.p
              className={cn(
                "mb-2 line-clamp-3 w-full text-balance text-left text-base text-foreground text-gray-800",
                "sm:line-clamp-4",
                "md:text-lg",
              )}
              variants={subtitleVariants}
            >
              {description
                ? description
                : "Tailored for advanced learners, this course focuses on real-life scenarios, idiomatic expressions, and nuanced vocabulary to enhance conversational fluency through role-plays and discussions, empowering confident communication in English-speaking environments."}
            </motion.p>
          </div>
          {!notFound && (
            <div className="flex w-full flex-row items-center gap-2">
              <MotionButton
                variants={buttonOneVariants}
                variant="default"
                size={isMobile ? "sm" : "lg"}
                className={cn("w-full text-sm", "sm:w-fit sm:text-base")}
                custom={{ isMobile }}
                asChild
              >
                <Link href={`/programs/${slug}`}>
                  <Play size={22} className="mr-2 fill-current" />
                  Reproduce
                </Link>
              </MotionButton>
              <MotionButton
                variants={buttonTwoVariants}
                variant="outline"
                size={isMobile ? "sm" : "lg"}
                className={cn("w-full text-sm", "sm:w-fit sm:text-base")}
                custom={{ isMobile: isMobile }}
                asChild
              >
                <Link href={`/programs/${slug}`}>
                  <Info size={22} className="mr-2" />
                  More information
                </Link>
              </MotionButton>
            </div>
          )}
        </MaxWidthWrapper>
      </motion.div>
    );
  },
);

HeroCard.displayName = "HeroCard";
