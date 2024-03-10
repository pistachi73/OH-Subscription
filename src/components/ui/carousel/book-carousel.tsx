"use client";

import React from "react";

import Image from "next/image";

import { cn } from "../../../lib/utils";

import { CarouselHeader } from "./carousel-header";
import { useCarrousel } from "./use-carrousel";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const BookCard = ({
  month,
  publishDate,
}: {
  month?: string;
  publishDate?: string;
}) => {
  return (
    <div className="flex justify-end justify-items-stretch">
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
      <div className="relative aspect-[3/4] shrink-0 basis-3/5 overflow-hidden rounded-md">
        <span className="absolute left-1 top-1 z-10 h-fit shrink-0 rounded bg-primary-800/70 bg-opacity-80 px-1 py-0.5 text-2xs font-medium text-white">
          Beginner
        </span>
        {publishDate && (
          <div className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-sm bg-gradient-to-t from-primary-900 to-primary-700 p-1 px-2 text-center ">
            <p className="text-3xs  text-primary-200">Coming soon</p>
            <p className="text-xs font-medium text-primary-50"> 24/03/2024</p>
          </div>
        )}
        <Image
          src="/images/book-thumbnail.png"
          alt="cover"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export const BookCarousel = ({ books, title, href }: BookCarouselProps) => {
  const { slideSizeClassname, slidesToScroll } = useCarrousel();

  return (
    <div className="my-[3vw]">
      <CarouselHeader title={title} href={href} />
      <Carousel
        opts={{
          slidesToScroll,
          align: "start",
        }}
      >
        <CarouselContent>
          {Array.from({ length: 11 }).map((_, index) => (
            <CarouselItem key={index} className={slideSizeClassname}>
              <BookCard
                month={index % 2 === 0 ? "FEB" : "MAR"}
                publishDate={index % 2 === 0 ? "24/03/2024" : undefined}
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
