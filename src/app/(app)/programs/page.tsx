import { Programs } from "@/components/programs";
import { FilteredProgramsProvider } from "@/components/programs/program-filter/filtered-programs-context";
import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { LEVEL_OPTIONS } from "@/lib/formatters/formatLevel";
import { api } from "@/trpc/server";

type ProgramsPageProps = {
  searchParams?: { [key: string]: string | undefined };
};

const ProgramsPage = async ({ searchParams }: ProgramsPageProps) => {
  const initialPrograms = await api.program.getProgramsForCards.query({
    limit: 20,
    ...(searchParams?.categories && {
      categoryIds: searchParams.categories.split(",").map(Number),
    }),
    ...(searchParams?.teachers && {
      teacherIds: searchParams.teachers.split(",").map(Number),
    }),
    ...(searchParams?.levels && { levelIds: searchParams.levels.split(",") }),
    ...(searchParams?.search && { searchQuery: searchParams.search }),
  });

  const categories = await api.category.getAll.query();
  const teachers = await api.teacher.getAll.query();

  const CATEGORY_OPTIONS: Option[] = categories.map((category) => ({
    label: category.name,
    value: category.id.toString(),
  }));

  const TEACHER_OPTIONS: Option[] = teachers.map((teacher) => ({
    label: teacher.name,
    value: teacher.id.toString(),
  }));

  return (
    <div className="header-translate">
      <FilteredProgramsProvider
        initialPrograms={initialPrograms}
        categoryOptions={CATEGORY_OPTIONS}
        teacherOptions={TEACHER_OPTIONS}
        levelOptions={LEVEL_OPTIONS}
      >
        <Programs />
      </FilteredProgramsProvider>
    </div>
  );
};

export default ProgramsPage;
