"use client";

import React, { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { api } from "@/trpc/react";
import type { ProgramCard } from "@/types";

const FilteredProgramsContext = React.createContext<{
  filteredPrograms: ProgramCard[];
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
  initialCategory,
  categoryOptions,
  teacherOptions,
  levelOptions,
}: {
  children: React.ReactNode;
  initialPrograms: ProgramCard[];
  categoryOptions: Option[];
  teacherOptions: Option[];
  levelOptions: Option[];
  initialCategory?: string;
}) => {
  const params = useSearchParams();
  const teachers = params.get("teachers");
  const levels = params.get("levels");
  const categories = params.get("categories");
  const search = params.get("search");

  const { data: filteredPrograms, isFetching: isFiltering } =
    api.program.getProgramCards.useQuery(
      {
        ...(teachers && { teacherIds: teachers.split(",").map(Number) }),
        ...((categories || initialCategory) && {
          categorySlugs: [
            ...(categories ? categories.split(",") : []),
            ...(initialCategory ? [initialCategory] : []),
          ],
        }),
        ...(levels && { levelIds: levels.split(",") }),
        ...(search && { searchQuery: search }),
        minQueryTime: 500,
      },
      {
        initialData: initialPrograms,
        refetchOnReconnect: false,
        refetchOnMount: false,
      },
    );

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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