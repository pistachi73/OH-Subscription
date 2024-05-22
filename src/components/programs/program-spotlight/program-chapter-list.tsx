import type { ProgramSpotlight } from "@/server/db/schema.types";
import { Chapter } from "./program-chapter";
import { SimilarPrograms } from "./program-similars";

type ProgramChapterListProps = {
  chapters: NonNullable<ProgramSpotlight>["chapters"];
};

export const ProgramChapterList = ({ chapters }: ProgramChapterListProps) => {
  if (!chapters?.length) return null;

  return (
    <div className="my-8 w-full sm:my-12 ">
      <div className="space-y-4 sm:space-y-8">
        {chapters.map((chapter) => (
          <Chapter key={chapter.slug} chapter={chapter} />
        ))}
      </div>
      <SimilarPrograms />
    </div>
  );
};
