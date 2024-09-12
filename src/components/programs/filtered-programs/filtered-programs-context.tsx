"use client";

import React, { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { api } from "@/trpc/client";
import type { ProgramCard, ProgramLevel } from "@/types";

const FilteredProgramsContext = React.createContext<{
  filteredPrograms: ProgramCard[];
  isFetched: boolean;
  categoryOptions: Option[];
  teacherOptions: Option[];
  levelOptions: Option[];
}>({
  filteredPrograms: [],
  isFetched: false,
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
  initialCategory,
  initialLevel,
}: {
  children: React.ReactNode;
  initialPrograms: ProgramCard[];
  categoryOptions: Option[];
  teacherOptions: Option[];
  levelOptions: Option[];
  initialCategory?: string;
  initialLevel?: ProgramLevel;
}) => {
  const params = useSearchParams();
  const teachers = params.get("teachers");
  const levels = params.get("levels");
  const categories = params.get("categories");
  const search = params.get("search");

  const {
    data: filteredPrograms,
    isFetched,
    refetch,
  } = api.program.getProgramCards.useQuery(
    {
      teacherIds: teachers?.split(",").map(Number),
      levelIds: [
        ...(levels?.split(",") ?? []),
        ...(initialLevel ? [initialLevel] : []),
      ],
      categorySlugs: [
        ...(categories?.split(",") ?? []),
        ...(initialCategory ? [initialCategory] : []),
      ],
      searchQuery: search,
      minQueryTime: 500,
    },
    {
      initialData: initialPrograms,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  );

  useEffect(() => {
    refetch();
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 2);
  }, [params, refetch]);

  return (
    <FilteredProgramsContext.Provider
      value={{
        filteredPrograms,
        isFetched,
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
