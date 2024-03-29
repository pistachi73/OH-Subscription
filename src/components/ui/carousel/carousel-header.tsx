import { ChevronRight } from "lucide-react";

import Link from "next/link";

type CarouselHeaderProps = {
  title: string;
  href?: string;
};

export const CarouselHeader = ({ title, href }: CarouselHeaderProps) => {
  const HeaderTag = href ? Link : "h2";

  return (
    <HeaderTag
      href={href as string}
      className="group/carousel-title relative mb-1 ml-[3%] flex w-fit items-center gap-3 2xl:ml-14 "
    >
      <span className="flex items-center gap-2 text-base font-medium tracking-tight lg:text-xl">
        {title}
        {href && (
          <span className="flex items-center gap-1 text-2xs text-orange-500 md:text-sm">
            <span className=" -translate-x-4 opacity-0   duration-150 ease-in group-hover/carousel-title:translate-x-0 group-hover/carousel-title:opacity-100 group-hover/carousel-title:delay-200 ">
              View all
            </span>
            <ChevronRight
              size={16}
              className="-translate-x-8 opacity-0  ease-in group-hover/carousel-title:translate-x-0 group-hover/carousel-title:opacity-100 group-hover/carousel-title:duration-200"
            />
          </span>
        )}
      </span>
    </HeaderTag>
  );
};
