import { FilteredPrograms } from "@/components/programs/filtered-programs";
import { SkeletonFilteredPrograms } from "@/components/programs/filtered-programs/skeleton-filtered-programs";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { Suspense } from "react";

export const metadata = {
  title: "Find the best programs for your needs | Filter & Search Programs",
  description:
    "Explore and filter a wide variety of educational programs by categories, teachers, and levels. Find the perfect program for your learning goals.",
  keywords:
    "educational programs, program filter, search programs, categories, teachers, levels",
  viewport: "width=device-width, initial-scale=1",
};

type ProgramsPageProps = {
  searchParams?: { [key: string]: string | undefined };
};

const ProgramsPage = async ({ searchParams }: ProgramsPageProps) => {
  return (
    <>
      <MaxWidthWrapper className="relative z-10 mb-6 sm:mb-8 mt-8">
        <h1 className="text-foreground text-3xl font-bold tracking-tighter">
          Find the perfect programs
        </h1>
        <h2 className="mt-1 text-muted-foreground text-lg ">
          Refine your search and find the perfect prgram.
        </h2>
      </MaxWidthWrapper>
      <Suspense fallback={<SkeletonFilteredPrograms />}>
        <FilteredPrograms searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default ProgramsPage;
