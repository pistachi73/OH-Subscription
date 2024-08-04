import type { ProgramSpotlight } from "@/server/db/schema.types";
import { Chapter } from "./program-chapter";
import { RelatedPrograms } from "./program-related";

type ProgramChapterListProps = {
  program: NonNullable<ProgramSpotlight>;
};

export const ProgramChapterList = ({ program }: ProgramChapterListProps) => {
  if (!program.chapters?.length) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:gap-y-20 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {program.chapters.map((chapter) => (
          <Chapter key={chapter.slug} chapter={chapter} />
        ))}
      </div>
      <RelatedPrograms program={program} />
    </div>
  );
};
