import { LEVEL_OPTIONS } from "@/lib/formatters/formatLevel";
import { api } from "@/trpc/server";

import { ProgramFilter } from "./filter";
import { FilteredProgramsProvider } from "./filtered-programs-context";
import { FilteredProgramsList } from "./filtered-programs-list";

import type { Option } from "@/components/ui/admin/admin-multiple-select";

export const FilteredPrograms = async ({
  initialCategory,
  searchParams,
}: {
  initialCategory?: string;
  searchParams?: { [key: string]: string | undefined };
}) => {
  const [initialPrograms, categories, teachers] = await Promise.all([
    api.program.getProgramsForCards.query({
      limit: 20,
      ...((searchParams?.categories || initialCategory) && {
        categorySlugs: [
          ...(searchParams?.categories
            ? searchParams.categories.split(",")
            : []),
          ...(initialCategory ? [initialCategory] : []),
        ],
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
    value: category.slug.toString(),
    disabled: category.slug === initialCategory,
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
      <ProgramFilter />
      <FilteredProgramsList />
    </FilteredProgramsProvider>
  );
};
