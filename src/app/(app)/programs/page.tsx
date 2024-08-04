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
    <div className="min-h-[50vh]">
      <MaxWidthWrapper className="relative z-10 mt-8 sm:mt-12">
        <h1 className="text-foreground text-xl sm:text-3xl font-semibold tracking-tight">
          Find the perfect program
        </h1>
      </MaxWidthWrapper>
      <Suspense fallback={<SkeletonFilteredPrograms />}>
        <FilteredPrograms searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default ProgramsPage;
