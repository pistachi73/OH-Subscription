"use client";
import { CardList } from "@/components/ui/cards/card-list";
import type { ProgramSpotlight } from "@/server/db/schema.types";
import { api } from "@/trpc/react";

type RelatedProgramsProps = {
  program: NonNullable<ProgramSpotlight>;
};

export const RelatedPrograms = ({ program }: RelatedProgramsProps) => {
  const programCategoryIds = program.categories.map(({ id }) => id);

  const { data, isLoading } = api.program.getProgramsForCards.useQuery({
    categoryIds: programCategoryIds,
  });

  const relatedPrograms = data?.filter((p) => p.slug !== program.slug);

  return (
    <div className=" mx-auto my-8 w-full max-w-[1400px] sm:my-12">
      <h2 className="text-lg font-semibold sm:text-xl">You might also like</h2>

      <div className="grid grid-cols-2  gap-x-2 gap-y-4 py-4 sm:grid-cols-3 lg:grid-cols-4">
        <CardList
          programs={relatedPrograms}
          isLoading={isLoading}
          initialAnimation={false}
          cardsPerRow={{
            sm: 2,
            md: 3,
            lg: 4,
          }}
        />
      </div>
    </div>
  );
};
