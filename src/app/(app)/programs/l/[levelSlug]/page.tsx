import { FilteredPrograms } from "@/components/programs/filtered-programs";
import { SkeletonFilteredPrograms } from "@/components/programs/filtered-programs/skeleton-filtered-programs";
import { ChevronRightIcon } from "@/components/ui/icons";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import Link from "next/link";
import { Suspense } from "react";

import { formatLevelBySlug } from "@/lib/formatters/formatLevel";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: { params: { levelSlug: string } }) {
  const level = formatLevelBySlug(params.levelSlug);

  if (!level) {
    return null;
  }

  return {
    title: `${level.longFormat} Programs | Filter & Search Programs`,
    description:
      "Explore and filter a wide variety of educational programs by categories, teachers, and levels. Find the perfect program for your learning goals.",
    keywords:
      "educational programs, program filter, search programs, categories, teachers, levels",
  };
}

type ProgramsPageProps = {
  searchParams: { [key: string]: string | undefined };
  params: { levelSlug: string };
};

const ProgramsPage = async ({ searchParams, params }: ProgramsPageProps) => {
  const level = formatLevelBySlug(params.levelSlug);

  if (!level) {
    redirect("/programs");
  }

  return (
    <div className="min-h-[80vh]">
      <MaxWidthWrapper className="relative z-10 mt-8 sm:mt-12">
        <h1 className="flex items-center gap-2 flex-wrap">
          <Link
            href={{
              pathname: "/programs",
              query: searchParams,
            }}
            className=" text-lg sm:text-xl text-muted-foreground hover:underline"
          >
            Programs
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground  text-xl sm:text-3xl font-semibold tracking-tight">
            {level.longFormat} Programs
          </span>
        </h1>
      </MaxWidthWrapper>
      <Suspense fallback={<SkeletonFilteredPrograms />}>
        <FilteredPrograms
          searchParams={searchParams}
          initialLevel={level.slug}
        />
      </Suspense>
    </div>
  );
};

export default ProgramsPage;
