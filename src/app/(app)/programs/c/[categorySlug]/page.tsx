import { FilteredPrograms } from "@/components/programs/filtered-programs";
import { SkeletonFilteredPrograms } from "@/components/programs/filtered-programs/skeleton-filtered-programs";
import { ChevronRightIcon } from "@/components/ui/icons";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { api } from "@/trpc/server";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: { params: { categorySlug: string } }) {
  const category = await api.category.getBySlug.query({
    slug: params.categorySlug,
  });

  if (!category) {
    return null;
  }

  return {
    title: `${category.name} Programs | Filter & Search Programs`,
    description:
      "Explore and filter a wide variety of educational programs by categories, teachers, and levels. Find the perfect program for your learning goals.",
    keywords:
      "educational programs, program filter, search programs, categories, teachers, levels",
  };
}

type ProgramsPageProps = {
  searchParams: { [key: string]: string | undefined };
  params: { categorySlug: string };
};

const ProgramsPage = async ({ searchParams, params }: ProgramsPageProps) => {
  const category = await api.category.getBySlug.query({
    slug: params.categorySlug,
  });

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-[80vh]">
      <MaxWidthWrapper className="relative z-10 mt-8 sm:mt-12">
        <h1 className="flex items-center gap-2 flex-wrap">
          <Link
            href="/programs"
            className=" text-lg sm:text-xl text-muted-foreground hover:underline"
          >
            Programs
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground  text-xl sm:text-3xl font-semibold tracking-tight">
            {category.name} Programs
          </span>
        </h1>
      </MaxWidthWrapper>
      <Suspense fallback={<SkeletonFilteredPrograms />}>
        <FilteredPrograms
          searchParams={searchParams}
          initialCategory={category.slug}
        />
      </Suspense>
    </div>
  );
};

export default ProgramsPage;
