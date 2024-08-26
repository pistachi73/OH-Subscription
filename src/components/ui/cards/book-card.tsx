"use client";

import { AnimatePresence, m } from "framer-motion";

import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChapterOutlineIcon } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cardsEase } from "@/lib/animation";
import { cn } from "@/lib/utils/cn";
import { Heart, InfoIcon, PlayIcon, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type BookCardProps = {
  lazy?: boolean;
  isLeftBorder?: boolean;
  isRightBorder?: boolean;
  publishDate?: string;
  className?: string;
};

export const BookCard = ({
  publishDate,
  isRightBorder,
  lazy,
  className,
}: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={cn(
        "group relative w-full ",
        !publishDate ? "cursor-pointer" : "pointer-events-none",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <section className="relative aspect-[6/9] shrink-0 overflow-visible group-hover:z-20">
        <div
          className={cn(
            "w-full h-full transition-transform ease-out",
            "group-hover:scale-125 group-hover:delay-300",
            {
              "group-hover:-translate-x-12": !isRightBorder,
              "origin-right flex-row-reverse": isRightBorder,
            },
          )}
        >
          <Badge
            variant="accent"
            className={cn(
              "absolute left-1 top-1 z-10 h-fit shrink-0 rounded px-1 py-0.5 text-3xs font-medium transition-opacity delay-0",
              "group-hover:opacity-0 group-hover:delay-300",
            )}
          >
            Beginner
          </Badge>
          <Image
            src="/images/book-thumbnail.png"
            alt="cover"
            fill
            className={cn(
              "rounded-lg delay-0 group-hover:delay-300 group-hover:transition-all object-cover group-hover:shadow-lg",
              isRightBorder && "group-hover:rounded-l-none",
              !isRightBorder && "group-hover:rounded-r-none",
            )}
          />
          {publishDate && (
            <div className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-sm bg-gradient-to-t from-primary-900 to-primary-800 p-1 px-2 text-center ">
              <p className="text-3xs  text-gray-400">Coming soon</p>
              <p className="text-xs font-medium text-gray-50"> 24/03/2024</p>
            </div>
          )}
        </div>
        <AnimatePresence>
          {isHovered && (
            <m.article
              initial={{
                opacity: 0,
                left: isRightBorder
                  ? "calc(-12.5% - 300px)"
                  : "calc(112.5% - 38px)",
              }}
              animate={{
                opacity: 1,
                left: isRightBorder
                  ? "calc(-25% - 300px)"
                  : "calc(112.5% - 48px)",
                transition: {
                  delay: 0.3,
                  duration: 0.15,
                  ease: cardsEase,
                },
              }}
              className={cn(
                "p-4 bg-background absolute top-[-12.5%] w-[300px] h-[125%] flex flex-col justify-between",
                "group-hover:shadow-lg",
                !isRightBorder && "rounded-r-lg",
                isRightBorder && " rounded-l-lg",
              )}
            >
              <div>
                <section className="flex flex-row justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
                      asChild
                    >
                      <Link href={"/programs/test"}>
                        <PlayIcon className="ml-0.5 w-6 h-6 fill-current" />
                      </Link>
                    </Button>
                    <p className="font-semibold tracking-tight text-base text-muted-foreground">
                      Play C1
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="accent"
                          className="w-12 h-12 rounded-full p-0"
                        >
                          <Heart className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6} className="p-1 px-2">
                        <p className="text-sm text-foreground">
                          Add to favorites
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="accent"
                          className="w-12 h-12 rounded-full p-0"
                          asChild
                        >
                          <Link href={"/programs/test"}>
                            <InfoIcon className="w-5 h-5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6} className="p-1 px-2">
                        <p className="text-sm text-foreground">Details</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </section>
                <section className="mt-2 space-y-0.5">
                  <h3 className="text-lg font-bold">Hamlet</h3>
                  <p className="line-clamp-2 text-base text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur. Enim dolor porttitor
                    at scelerisque pellentesque imperdiet a enim ullamcorper.
                  </p>
                </section>
              </div>

              <section className="mt-5 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Tooltip key="hello">
                      <TooltipTrigger asChild>
                        <Avatar
                          className={cn(
                            "h-14 w-14 border-2",
                            index !== 0 && "-ml-3",
                          )}
                        >
                          <AvatarImage src={undefined} />
                          <AvatarFallback className="bg-accent relative">
                            <Image
                              src="/images/avatar-placeholder.png"
                              fill
                              alt="teacher avatar placeholder"
                            />

                            <User
                              className="text-accent-foreground"
                              size={20}
                            />
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent
                        align="center"
                        side="top"
                        className="p-1 px-3 text-center"
                      >
                        <p className="text-sm  text-foreground">Jhon Doe</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Teacher at OH
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-1 text-foreground">
                  <ChapterOutlineIcon className="fill-foreground w-9 h-9" />
                  <p className="text-xs text-muted-foreground">11 chapters</p>
                </div>
              </section>
            </m.article>
          )}
        </AnimatePresence>
      </section>
    </article>
  );
};
