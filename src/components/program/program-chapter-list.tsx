"use client";

import { Chapter } from "./components/program-chapter";
import { SimilarPrograms } from "./similar-programs";

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
