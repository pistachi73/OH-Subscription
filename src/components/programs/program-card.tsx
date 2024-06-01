"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Heart, LibraryBig, Play, User } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DeviceOnly } from "@/components/ui/device-only/device-only";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCardAnimation } from "@/hooks/use-card-animation";
import { cardAnimationConfig } from "@/lib/animation";
import { levelMap } from "@/lib/formatters/formatLevel";
import { cn, getImageUrl } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";
import { Badge, badgeVariants } from "../ui/badge";

export type ProgramCardProps = {
  lazy?: boolean;
  isLeftBorder?: boolean;
  isRightBorder?: boolean;
  program: RouterOutputs["program"]["getProgramsForCards"][0];
};

const variants: Variants = {
  initial: {
    scale: 1,
    transitionEnd: {
      zIndex: 10,
    },
    y: 0,
    transition: {
      duration: cardAnimationConfig.duration,
      ease: cardAnimationConfig.ease,
    },
  },
  animate: {
    scale: 1.3,
    y: "-10%",
    zIndex: 50,
    transition: {
      duration: cardAnimationConfig.duration,
      ease: cardAnimationConfig.ease,
    },
  },
};

const imageVariants: Variants = {
  initial: {
    boxShadow: "none",
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    transition: { duration: 0.1 },
  },
  animate: {
    boxShadow: cardAnimationConfig.shadow,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    transition: { duration: 0.1 },
  },
};

const textVariants: Variants = {
  initial: {
    opacity: 0,
    transition: {
      duration: cardAnimationConfig.duration / 1.5,
      ease: cardAnimationConfig.ease,
    },
  },
  animate: {
    opacity: 1,
    transition: {
      duration: cardAnimationConfig.duration / 1.5,
      ease: cardAnimationConfig.ease,
    },
  },
};

const tagVariants: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: 0,
    transition: {
      duration: cardAnimationConfig.duration,
      ease: cardAnimationConfig.ease,
    },
  },
};

const MotionBadge = motion(Badge);

export const ProgramCard = ({
  lazy,
  isLeftBorder,
  isRightBorder,
  program,
}: ProgramCardProps) => {
  const {
    level,
    thumbnail,
    description,
    teachers,
    slug,
    title,
    totalChapters,
  } = program;

  const { hovered, setCanHover, onMouseEnter, onMouseLeave } =
    useCardAnimation();

  return (
    <div
      className=" relative flex aspect-video h-full w-full rounded-md"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Badge
        variant="accent"
        className="absolute left-1 top-1 z-10 h-fit shrink-0 rounded px-1 py-0.5 text-3xs font-medium"
      >
        {levelMap[level].shortFormat}
      </Badge>

      <Link href={`/programs/${slug}`}>
        <Image
          src={
            thumbnail ? getImageUrl(thumbnail) : "/images/video-thumbnail.png"
          }
          alt="video"
          fill
          className="rounded-sm"
          loading={lazy ? "lazy" : "eager"}
        />
      </Link>
      <DeviceOnly allowedDevices="desktop">
        <AnimatePresence onExitComplete={() => setCanHover(true)}>
          {hovered && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="initial"
              variants={variants}
              className={cn("absolute h-full w-full", {
                "origin-left": isLeftBorder,
                "origin-right": isRightBorder,
              })}
            >
              <motion.div
                className={cn("relative aspect-video w-full rounded-t-sm")}
                variants={imageVariants}
              >
                <Image
                  src="/images/video-thumbnail.png"
                  alt="video"
                  fill
                  className="rounded-t-sm"
                  loading={lazy ? "lazy" : "eager"}
                />

                <motion.div
                  variants={tagVariants}
                  className={cn(
                    badgeVariants({ variant: "accent" }),
                    "absolute top-1 left-1",
                    "rounded px-1 py-0.5 text-3xs font-medium",
                  )}
                >
                  {levelMap[level].shortFormat}
                </motion.div>

                <motion.div
                  className="absolute bottom-3 left-3 flex items-center space-x-1"
                  variants={textVariants}
                >
                  <Button
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-primary bg-primary-50/70"
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <Link href={`/programs/${slug}`}>
                      <Play
                        className="-ml-px fill-primary stroke-primary"
                        size={16}
                      />
                    </Link>
                  </Button>

                  <Button
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-primary bg-primary-50/70"
                    variant="outline"
                    size="icon"
                  >
                    <Heart className="stroke-primary " size={16} />
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                variants={textVariants}
                className="w-full -translate-y-px  rounded-b-sm bg-background p-4 shadow-md transition-opacity"
              >
                <div className="mt-px space-y-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-[6px]">
                      <h3 className=" text-left text-base font-bold tracking-tight text-foreground">
                        {title}
                      </h3>

                      <div
                        className={cn(
                          badgeVariants({ variant: "accent" }),
                          "inline-block",
                          "rounded px-1 py-0.5 text-3xs font-medium",
                        )}
                      >
                        {levelMap[level].shortFormat}
                      </div>
                    </div>

                    <p className="line-clamp-3 text-left  text-xs text-foreground">
                      {description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="-gap-2 flex flex-row">
                      {teachers.map(({ id, image, name }) => (
                        <TooltipProvider key={`teacher_${id}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="-ml-2 h-9 w-9 border border-input">
                                <AvatarImage
                                  src={image ? getImageUrl(image) : undefined}
                                />
                                <AvatarFallback className="bg-accent">
                                  <User
                                    className="text-accent-foreground"
                                    size={16}
                                  />
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent className="p-1 px-2">
                              <p className="text-2xs  text-foreground">
                                {name}
                              </p>
                              <p className="text-3xs text-muted-foreground">
                                Teacher at OH
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    <div className="flex flex-col items-center gap-0.5 text-foreground">
                      <LibraryBig size={16} />
                      <p className="text-3xs">{totalChapters} chapters</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DeviceOnly>
    </div>
  );
};
