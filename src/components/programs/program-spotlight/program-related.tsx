"use client";
import { api } from "@/trpc/client";
import { ProgramCarousel } from "../program-carousel";
import { useProgramSpotlightContext } from "./program-spotlight-context";

export const RelatedPrograms = () => {
  const { data: program } = useProgramSpotlightContext();
  const { data, isLoading } = api.program.getProgramCards.useQuery({
    searchQuery: program.title,
    limit: 7,
  });

  const relatedPrograms = data?.filter((p) => p.slug !== program.slug);

  console.log({ relatedPrograms });

  return (
    <section className="w-full my-8 sm:my-12">
      <ProgramCarousel programs={relatedPrograms} title="You might also like" />
    </section>
  );
};
