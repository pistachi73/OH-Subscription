"use client";

import { BookCard, type BookCardProps } from "../cards/book-card";

import { CarouselHeader } from "./carousel-header";
import { useCarouselBorders, useCarouselSettings } from "./carousel.hooks";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils/cn";

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

const CarouselBookCard = ({
  index,
  month,
  ...bookCardProps
}: BookCardProps & { index: number; month: string }) => {
  const { isLeftBorder, isRightBorder } = useCarouselBorders({ index });

  return (
    <div
      className={cn(
        "relative flex justify-end justify-items-stretch overflow-visible",
      )}
    >
      <p
        className={cn(
          "book-text-border relative cursor-default font-mono font-bold tracking-tighter text-transparent",
          "vertical-rl rotate-180",
          "text-7xl !leading-[60%] md:text-6xl lg:text-8xl 2xl:text-[110px]",
        )}
      >
        {month}
        <span aria-hidden="true" className="vertical-rl absolute left-0 top-0 ">
          {month}
        </span>
      </p>
      <BookCard
        isLeftBorder={isLeftBorder}
        isRightBorder={isRightBorder}
        className="basis-3/5"
        {...bookCardProps}
      />
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
              <CarouselBookCard
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
