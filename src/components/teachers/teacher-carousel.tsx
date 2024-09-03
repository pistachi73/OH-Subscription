"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselHeader } from "@/components/ui/carousel/carousel-header";
import { cn } from "@/lib/utils/cn";
import type { Teacher } from "@/types";
import { useCarouselSettings } from "../ui/carousel/carousel.hooks";
import { TeacherCard } from "./teacher-card";

type TeacherCarouselProps = {
  title: string;
  teachers?: Teacher[];
};

export const TeacherCarousel = ({ teachers, title }: TeacherCarouselProps) => {
  const { slideSizeClassname, slidesPerView } = useCarouselSettings();

  if (!teachers?.length) {
    return null;
  }

  return (
    <div className="my-8 md:my-10 lg:my-12">
      <CarouselHeader title={title} />
      <Carousel
        slidesPerView={slidesPerView}
        totalItems={teachers?.length ?? slidesPerView}
        opts={{
          slidesToScroll: slidesPerView,
          align: "start",
          duration: 20,
          inViewThreshold: 0.5,
        }}
      >
        <CarouselContent>
          {teachers?.map((teacher) => {
            return (
              <CarouselItem
                key={`${title}-${teacher.id}`}
                className={cn(slideSizeClassname)}
              >
                <TeacherCard teacher={teacher} />
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
