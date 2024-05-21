"use client";

import React, { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";

const FilteredProgramsContext = React.createContext<{
  filteredPrograms: RouterOutputs["program"]["getProgramsForCards"];
  isFiltering: boolean;
  categoryOptions: Option[];
  teacherOptions: Option[];
  levelOptions: Option[];
}>({
  filteredPrograms: [],
  isFiltering: false,
  categoryOptions: [],
  teacherOptions: [],
  levelOptions: [],
});

export const FilteredProgramsProvider = ({
  children,
  initialPrograms,
  categoryOptions,
  teacherOptions,
  levelOptions,
}: {
  children: React.ReactNode;
  initialPrograms: RouterOutputs["program"]["getProgramsForCards"];
  categoryOptions: Option[];
  teacherOptions: Option[];
  levelOptions: Option[];
}) => {
  const params = useSearchParams();
  const teachers = params.get("teachers");
  const levels = params.get("levels");
  const categories = params.get("categories");
  const search = params.get("search");

  const { data: filteredPrograms, isFetching: isFiltering } =
    api.program.getProgramsForCards.useQuery(
      {
        ...(teachers && { teacherIds: teachers.split(",").map(Number) }),
        ...(categories && { categoryIds: categories.split(",").map(Number) }),
        ...(levels && { levelIds: levels.split(",") }),
        ...(search && { searchQuery: search }),
        minQueryTime: 500,
      },
      {
        initialData: initialPrograms,
        refetchOnWindowFocus: false,
      },
    );

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 2);
  }, [params]);

  return (
    <FilteredProgramsContext.Provider
      value={{
        filteredPrograms,
        isFiltering,
        categoryOptions,
        teacherOptions,
        levelOptions,
      }}
    >
      {children}
    </FilteredProgramsContext.Provider>
  );
};

export const useFilteredPrograms = () => {
  const context = React.useContext(FilteredProgramsContext);

  if (!context) {
    throw new Error(
      "useFilteredPrograms must be used within a <FilteredProgramsProvider  />",
    );
  }

  return context;
};
