import { LEVEL_OPTIONS as INITIAL_LEVEL_OPTIONS } from "@/lib/formatters/formatLevel";
import { api } from "@/trpc/server";

import { ProgramFilter } from "./filter";
import { FilteredProgramsProvider } from "./filtered-programs-context";
import { FilteredProgramsList } from "./filtered-programs-list";

import type { Option } from "@/components/ui/admin/admin-multiple-select";
import type { ProgramLevel } from "@/types";

export const FilteredPrograms = async ({
  initialCategory,
  initialLevel,
  searchParams,
}: {
  initialCategory?: string;
  initialLevel?: ProgramLevel;
  searchParams?: { [key: string]: string | undefined };
}) => {
  const [initialPrograms, categories, teachers] = await Promise.all([
    api.program.getProgramCards.query({
      limit: 20,
      categorySlugs: [
        ...(searchParams?.categories?.split(",") ?? []),
        ...(initialCategory ? [initialCategory] : []),
      ],
      teacherIds: searchParams?.teachers?.split(",").map(Number) ?? [],
      levelIds: [
        ...(searchParams?.levels?.split(",") ?? []),
        ...(initialLevel ? [initialLevel] : []),
      ],
      searchQuery: searchParams?.search,
    }),
    api.category.getAll.query(),
    api.teacher._getAll.query(),
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

  const LEVEL_OPTIONS: Option[] = INITIAL_LEVEL_OPTIONS.map((level) => ({
    ...level,
    disabled: level.value === initialLevel,
  }));

  return (
    <FilteredProgramsProvider
      initialPrograms={initialPrograms}
      categoryOptions={CATEGORY_OPTIONS}
      teacherOptions={TEACHER_OPTIONS}
      levelOptions={LEVEL_OPTIONS}
      initialCategory={initialCategory}
      initialLevel={initialLevel}
    >
      <ProgramFilter />
      <FilteredProgramsList />
    </FilteredProgramsProvider>
  );
};
