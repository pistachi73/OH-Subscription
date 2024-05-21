"use client";

import { Chapter } from "./program-chapter";
import { SimilarPrograms } from "./program-similars";

export const ProgramChapterList = () => {
  return (
    <div className="my-8 w-full sm:my-12 ">
      <div className="space-y-4 sm:space-y-8">
        {Array.from({ length: 4 }, (_, i) => (
          <Chapter key={i} />
        ))}
      </div>
      <SimilarPrograms />
    </div>
  );
};
