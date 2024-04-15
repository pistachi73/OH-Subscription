"use client";

import { Chapter } from "./components/chapter";
import { SimilarSeries } from "./similar-series";

import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

export const Chapters = () => {
  return (
    <MaxWidthWrapper className="mx-auto my-8 max-w-[1600px] sm:my-12 ">
      <div className="space-y-4 sm:space-y-8">
        {Array.from({ length: 4 }, (_, i) => (
          <Chapter key={i} />
        ))}
      </div>
      <SimilarSeries />
    </MaxWidthWrapper>
  );
};
