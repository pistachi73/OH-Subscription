"use client";

import { CalendarClock, Heart, LibraryBig, Play, Share2 } from "lucide-react";

import { DeviceOnly } from "../ui/device-only/device-only";
import { HeroImage } from "../ui/hero-image";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";

import { Button } from "@/components/ui/button";

type ProgramHeroCardProps = {};

export const ProgramHeroCard = ({}: ProgramHeroCardProps) => {
  return (
    <div className="relative mb-8 max-h-[80vh] w-full sm:mb-0 sm:-translate-y-[var(--header-height)] lg:h-[76vw]">
      <HeroImage
        src="/images/hero-thumbnail-2.jpg"
        alt="testing"
        containerClassname=" max-h-[80vh]"
      />

      <MaxWidthWrapper className="relative z-30 mx-0 flex  h-full  flex-col  gap-4  before:top-0 before:h-[46vw] before:min-h-[100px] before:content-[''] lg:justify-end lg:before:content-none">
        <div className=" space-y-4 sm:w-3/4 lg:max-w-[56ch] 2xl:max-w-[64ch]">
          <h1 className="text-left font-sans text-3xl font-semibold leading-tight  tracking-tighter xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
            English around the world
          </h1>
          <p className="w-full text-left text-sm font-light text-gray-800 sm:text-base lg:text-lg">
            {1 % 2 === 0
              ? "Ideal for beginners to intermediate learners, this course provides comprehensive coverage of grammar essentials through interactive lessons and quizzes, boosting both written and spoken communication skills."
              : "Tailored for advanced learners, this course focuses on real-life scenarios, idiomatic expressions, and nuanced vocabulary to enhance conversational fluency through role-plays and discussions, empowering confident communication in English-speaking environments."}
          </p>
        </div>

        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          <p className="flex flex-row items-center gap-2 text-sm text-gray-800 sm:text-base lg:text-lg">
            <CalendarClock size={18} />
            Last update: 02/2024
          </p>

          <p className="flex flex-row items-center gap-2 text-sm text-gray-800 sm:text-base lg:text-lg">
            <LibraryBig size={18} />
            12 chapters
          </p>
          <div className="flex flex-row gap-1">
            <p className="rounded-sm  bg-gray-800  px-[6px] py-1 text-xs text-white sm:text-sm lg:text-base">
              Grammar
            </p>
            <p className="rounded-sm  bg-gray-800 px-[6px] py-1 text-xs text-white sm:text-sm lg:text-base">
              HD
            </p>
            <p className="rounded-sm  bg-gray-800 px-[6px] py-1 text-xs text-white sm:text-sm lg:text-base">
              Vocabulary
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-2 overflow-y-clip sm:flex-row">
          <DeviceOnly allowedDevices={["tablet", "desktop"]}>
            <Button variant="default" size="lg" className="w-fit">
              <Play size={22} className="mr-2 fill-current" />
              Reproduce
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
            >
              <Heart size={22} className=" " />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
            >
              <Share2 size={22} className=" " />
            </Button>
          </DeviceOnly>
          <DeviceOnly allowedDevices={["mobile"]}>
            <Button
              variant="default"
              size="sm"
              className="w-full text-sm sm:text-base"
            >
              <Play size={22} className="mr-2 fill-current" />
              Reproduce
            </Button>
            <div className="flex w-full flex-row gap-2">
              <Button variant="outline" size="sm" className="basis-1/2">
                <Heart size={22} className="mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="basis-1/2">
                <Share2 size={22} className="mr-2" />
                Share
              </Button>
            </div>
          </DeviceOnly>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
