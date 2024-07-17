import { Programs } from "@/components/programs";
import { FilteredProgramsProvider } from "@/components/programs/program-filter/filtered-programs-context";
import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { LEVEL_OPTIONS } from "@/lib/formatters/formatLevel";
import { api } from "@/trpc/server";

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
  const [initialPrograms, categories, teachers] = await Promise.all([
    api.program.getProgramsForCards.query({
      limit: 20,
      ...(searchParams?.categories && {
        categoryIds: searchParams.categories.split(",").map(Number),
      }),
      ...(searchParams?.teachers && {
        teacherIds: searchParams.teachers.split(",").map(Number),
      }),
      ...(searchParams?.levels && { levelIds: searchParams.levels.split(",") }),
      ...(searchParams?.search && { searchQuery: searchParams.search }),
    }),
    api.category.getAll.query(),
    api.teacher.getAll.query(),
  ]);

  const CATEGORY_OPTIONS: Option[] = categories.map((category) => ({
    label: category.name,
    value: category.id.toString(),
  }));

  const TEACHER_OPTIONS: Option[] = teachers.map((teacher) => ({
    label: teacher.name,
    value: teacher.id.toString(),
  }));

  return (
    <FilteredProgramsProvider
      initialPrograms={initialPrograms}
      categoryOptions={CATEGORY_OPTIONS}
      teacherOptions={TEACHER_OPTIONS}
      levelOptions={LEVEL_OPTIONS}
    >
      <Programs />
    </FilteredProgramsProvider>
  );
};

export default ProgramsPage;
