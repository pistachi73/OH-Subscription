import { api } from "@/trpc/react";
import type { ProgramSpotlight } from "@/types";
import { ProgramList } from "../programs/program-list";

type ChapterRelatedProps = {
  program: NonNullable<ProgramSpotlight>;
};

export const ChapterRelated = ({ program }: ChapterRelatedProps) => {
  const { data, isLoading } = api.program.getProgramsForCards.useQuery(
    {
      searchQuery: program.title,
      limit: 4,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const relatedPrograms = data?.filter((p) => p.slug !== program.slug);

  return (
    <>
      <h2 className="text-xl font-medium tracking-tight">Related programs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:grid-cols-1">
        <ProgramList
          programs={relatedPrograms}
          isLoading={isLoading}
          initialAnimation={false}
          cardsPerRow={{
            xs: 1,
            md: 3,
            lg: 1,
          }}
        />
      </div>
    </>
  );
};
