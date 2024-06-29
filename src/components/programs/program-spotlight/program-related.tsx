"use client";
import type { ProgramSpotlight } from "@/server/db/schema.types";
import { api } from "@/trpc/react";
import { ProgramList } from "../program-list";

type RelatedProgramsProps = {
  program: NonNullable<ProgramSpotlight>;
};

export const RelatedPrograms = ({ program }: RelatedProgramsProps) => {
  const { data, isLoading } = api.program.getProgramsForCards.useQuery({
    searchQuery: program.title,
    limit: 7,
  });

  const relatedPrograms = data?.filter((p) => p.slug !== program.slug);

  return (
    <section className="w-full my-8 sm:my-12">
      <h2 className="text-lg font-semibold sm:text-xl">You might also like</h2>

      <div className="grid grid-cols-2  gap-x-2 gap-y-6 py-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <ProgramList
          programs={relatedPrograms}
          isLoading={isLoading}
          initialAnimation={false}
          cardsPerRow={{
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5,
          }}
        />
      </div>
    </section>
  );
};
