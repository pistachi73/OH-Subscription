import type { ProgramSpotlight } from "@/server/db/schema.types";
import { Chapter } from "./program-chapter";
import { RelatedPrograms } from "./program-related";

type ProgramChapterListProps = {
  program: NonNullable<ProgramSpotlight>;
};

export const ProgramChapterList = ({ program }: ProgramChapterListProps) => {
  if (!program.chapters?.length) return null;

  return (
    <div className="my-8 w-full sm:my-12 ">
      <div className="space-y-4 sm:space-y-8">
        {program.chapters.map((chapter) => (
          <Chapter key={chapter.slug} chapter={chapter} />
        ))}
      </div>
      <RelatedPrograms program={program} />
    </div>
  );
};
