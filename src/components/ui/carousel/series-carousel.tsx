"use client";

import { AnimatePresence, type Variants, motion } from "framer-motion";
import React from "react";
import { BsHeart, BsPerson, BsPlay } from "react-icons/bs";

import Image from "next/image";

import { CarouselHeader } from "./carousel-header";
import {
  useCarouselBorders,
  useCarouselItemAnimation,
  useCarouselSettings,
} from "./carousel.hooks";
import { type CarouselItemSharedProps } from "./carrousel.types";
import { animationConfig } from "./utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChapterIcon } from "@/components/ui/icons/chapter-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Video = {
  title: string;
  duration: string;
  level: string;
};

type SeriesCarouselProps = {
  title: string;
  videos?: Video[];
  href?: string;
};

type SeriesCardProps = CarouselItemSharedProps & {
  video?: Video;
  index: number;
};

const SeriesCard = ({ video, index, lazy }: SeriesCardProps) => {
  const { hovered, setCanHover, onMouseEnter, onMouseLeave } =
    useCarouselItemAnimation();

  const { isLeftBorder, isRightBorder } = useCarouselBorders({ index });
  const { duration, ease, shadow } = animationConfig;

  const variants: Variants = {
    initial: {
      scale: 1,
      transitionEnd: {
        zIndex: 10,
      },
      y: 0,
      transition: {
        duration,
        ease,
      },
    },
    animate: {
      scale: 1.3,
      y: "-70%",
      zIndex: 50,
      transition: {
        duration,
        ease,
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
      boxShadow: shadow,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      transition: { duration: 0.1 },
    },
  };

  const textVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: duration, ease } },
  };

  const tagVariants: Variants = {
    initial: { opacity: 1 },
    animate: { opacity: 0, transition: { duration: duration, ease } },
  };

  return (
    <div
      className=" relative flex aspect-video h-full w-full cursor-pointer rounded-sm "
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="absolute left-1 top-1 z-10 h-fit shrink-0 rounded bg-gray-800/70 px-1 py-0.5 text-2xs font-medium text-white">
        B1 - B2
      </span>

      <Image
        src="/images/video-thumbnail.png"
        alt="video"
        fill
        className="rounded-sm"
        loading={lazy ? "lazy" : "eager"}
      />
      <AnimatePresence onExitComplete={() => setCanHover(true)}>
        {hovered && (
          <motion.div
            key={index}
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
              className={cn("relative aspect-video w-full ")}
              variants={imageVariants}
            >
              <Image
                src="/images/video-thumbnail.png"
                alt="video"
                fill
                className="rounded-t-sm"
                loading={lazy ? "lazy" : "eager"}
              />

              <motion.span
                className="absolute left-1 top-1 z-10 h-fit shrink-0 rounded bg-gray-800/70 px-1 py-0.5 text-2xs font-medium text-white"
                variants={tagVariants}
              >
                B1 - B2
              </motion.span>
              <motion.div
                className="absolute bottom-3 left-3 flex items-center space-x-1"
                variants={textVariants}
              >
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full p-0 transition-transform hover:scale-105"
                  variant="default"
                >
                  <BsPlay size={20} />
                </Button>
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full p-0"
                  variant="secondary"
                >
                  <BsHeart size={14} />
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              variants={textVariants}
              className="  w-full -translate-y-px rounded-b-sm  bg-gray-50 p-4  shadow-md transition-opacity"
            >
              <div className="mt-px space-y-4">
                <div className="space-y-1">
                  <h3 className=" text-left text-sm font-bold">
                    English around the world
                    <span className="ml-1 inline-block w-fit -translate-y-0.5  rounded bg-gray-800 px-1 py-0.5 text-3xs font-normal text-white">
                      B1 - B2
                    </span>
                  </h3>
                  <p className="w-4/5 text-left text-2xs font-light text-primary-800">
                    Lorem ipsum dolor sit amet consectetur. Enim dolor porttitor
                    at scelerisque pellentesque imperdiet a enim ullamcorper.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="-gap-2 flex flex-row">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="-ml-2 h-9 w-9 border border-gray-800 first:ml-0 hover:bg-gray-400">
                              <AvatarImage src={undefined} />
                              <AvatarFallback className="bg-white">
                                <BsPerson className="text-gray-800" />
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent className="p-1 px-2">
                            <p className="text-2xs  font-medium text-gray-800">
                              John Doe
                            </p>
                            <p className="text-3xs  text-gray-600">
                              Teacher at OH
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <ChapterIcon className="h-7 w-7 fill-gray-800" />
                    <p className="text-3xs text-gray-600">12 chapters</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SeriesCarousel = ({
  videos,
  title,
  href,
}: SeriesCarouselProps) => {
  const length = videos?.length || 13;
  const { slideSizeClassname, slidesToScroll, slidesPerView } =
    useCarouselSettings();

  return (
    <div className="my-8 lg:my-12">
      <CarouselHeader title={title} href={href} />
      <Carousel
        slidesPerView={slidesPerView}
        totalItems={length}
        opts={{
          slidesToScroll,
          align: "start",
          duration: 20,
          inViewThreshold: 0.5,
        }}
      >
        <CarouselContent>
          {Array.from({ length }).map((_, index) => {
            return (
              <CarouselItem key={index} className={cn(slideSizeClassname)}>
                <SeriesCard index={index} lazy={index < slidesPerView} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
