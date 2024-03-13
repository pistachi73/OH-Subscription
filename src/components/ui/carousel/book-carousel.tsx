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

type Book = {
  title: string;
  duration: string;
  level: string;
};

type BookCarouselProps = {
  title: string;
  books?: Book[];
  href?: string;
};

type BookCardProps = CarouselItemSharedProps & {
  month?: string;
  publishDate?: string;

  index: number;
};

const BookCard = ({ month, publishDate, lazy, index }: BookCardProps) => {
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
      x: 0,
      ...(!isRightBorder && { left: "40%" }),
      transition: {
        duration,
        ease,
      },
    },
    animate: {
      scale: 1.3,
      zIndex: 50,
      ...(!isRightBorder && { x: "-25%" }),
      ...(!isLeftBorder && !isRightBorder && { x: "-25%" }),
      transition: {
        duration,

        ease,
      },
    },
  };

  const imageVariants: Variants = {
    initial: {
      zIndex: 0,
      boxShadow: "none",
      ...(!isRightBorder && {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
      }),
      ...(isRightBorder && {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
      }),
      transition: { duration, ease },
    },
    animate: {
      zIndex: 50,
      boxShadow: shadow,
      ...(!isRightBorder && {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      }),
      ...(isRightBorder && {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      }),
      transition: { duration, ease },
    },
  };

  const textVariants: Variants = {
    initial: { opacity: 0, boxShadow: "none" },
    animate: {
      opacity: 1,
      boxShadow: shadow,
      transition: { duration, ease },
    },
  };
  const buttonVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration, ease },
    },
  };

  const tagVariants: Variants = {
    initial: { opacity: 1 },
    animate: { opacity: 0, transition: { duration, ease } },
  };

  return (
    <div
      className={cn(
        "relative flex justify-end justify-items-stretch overflow-visible",
        {
          "cursor-pointer": !publishDate,
        },
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p
        className={cn(
          "book-text-border relative font-mono font-bold tracking-tighter text-transparent",
          "vertical-rl rotate-180",
          "text-7xl !leading-[60%] md:text-6xl lg:text-8xl 2xl:text-[110px]",
        )}
      >
        {month}
        <span aria-hidden="true" className="vertical-rl absolute left-0 top-0">
          {month}
        </span>
      </p>
      <div className="relative aspect-[3/4] shrink-0 basis-3/5  overflow-visible ">
        <span className="absolute left-1 top-1 z-10 h-fit shrink-0 rounded bg-primary-800/70 bg-opacity-80 px-1 py-0.5 text-2xs font-medium text-white">
          Beginner
        </span>
        <Image
          src="/images/book-thumbnail.png"
          alt="cover"
          fill
          className="rounded-sm object-cover"
        />
        {publishDate && (
          <div className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-sm bg-gradient-to-t from-primary-900 to-primary-700 p-1 px-2 text-center ">
            <p className="text-3xs  text-primary-200">Coming soon</p>
            <p className="text-xs font-medium text-primary-50"> 24/03/2024</p>
          </div>
        )}
      </div>
      {!publishDate && (
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => setCanHover(true)}
        >
          {hovered && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="initial"
              variants={variants}
              className={cn(
                "absolute top-0 z-50 flex h-full w-[375px] rounded-sm  ",
                {
                  "origin-left": !isRightBorder,
                  "origin-right flex-row-reverse": isRightBorder,
                },
              )}
            >
              <motion.div
                className={cn("relative aspect-[3/4] h-full bg-transparent")}
                variants={imageVariants}
              >
                <Image
                  src="/images/book-thumbnail.png"
                  alt="video"
                  fill
                  className={cn("object-cover", {
                    "rounded-l-sm": !isRightBorder,
                    "rounded-r-sm": isRightBorder,
                  })}
                  loading={lazy ? "lazy" : "eager"}
                />
                <motion.span
                  className="absolute left-1 top-1 z-10 h-fit shrink-0 rounded bg-gray-800/70 px-1 py-0.5 text-2xs font-medium text-white"
                  variants={tagVariants}
                >
                  Beginner
                </motion.span>
                <motion.div
                  className="absolute bottom-3 left-3 flex items-center space-x-1"
                  variants={buttonVariants}
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
                className={cn(
                  "h-full bg-gray-50 p-4",
                  { "-translate-x-1 rounded-r-sm": !isRightBorder },
                  { "translate-x-1 rounded-l-sm": isRightBorder },
                )}
              >
                <div
                  className={cn(
                    "flex h-full flex-col justify-between space-y-4",
                    {
                      "ml-1": !isRightBorder,
                      "mr-1": isRightBorder,
                    },
                  )}
                >
                  <div className="space-y-1">
                    <div className="space-y-0.5">
                      <h3 className=" text-left text-sm font-bold ">
                        Hamlet
                        <span className="ml-1 inline-block w-fit -translate-y-0.5  rounded bg-gray-800 px-1 py-0.5 text-3xs font-normal text-white">
                          Beginner
                        </span>
                      </h3>
                      <p className="text-3xs text-gray-600">
                        William Shakespeare
                      </p>
                    </div>

                    <p className="w-full text-left text-2xs font-light text-primary-800">
                      Lorem ipsum dolor sit amet consectetur. Enim dolor
                      porttitor at scelerisque pellentesque imperdiet a enim
                      ullamcorper.
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
                            <TooltipContent className="p-1 px-2 ">
                              <p className="text-center  text-2xs font-medium text-gray-800">
                                John Doe
                              </p>
                              <p className="text-center  text-3xs text-gray-600">
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
      )}
    </div>
  );
};

export const BookCarousel = ({ books, title, href }: BookCarouselProps) => {
  const length = books?.length || 11;
  const { slideSizeClassname, slidesToScroll, slidesPerView } =
    useCarouselSettings();

  return (
    <div className="my-[3vw]">
      <CarouselHeader title={title} href={href} />
      <Carousel
        totalItems={length}
        slidesPerView={slidesPerView}
        opts={{
          slidesToScroll,
          align: "start",
          inViewThreshold: 0.1,
        }}
      >
        <CarouselContent>
          {Array.from({ length }).map((_, index) => (
            <CarouselItem key={index} className={slideSizeClassname}>
              <BookCard
                month={index % 2 === 0 ? "FEB" : "MAR"}
                publishDate={index === 2 ? "24/03/2024" : undefined}
                lazy={index < slidesPerView}
                index={index}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
