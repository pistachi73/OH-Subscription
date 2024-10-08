import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useProgramsUrlQueryFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchFilter = searchParams.get("search");
  const teachersFilterArray = searchParams.get("teachers")?.split(",");
  const categoriesFilterArray = searchParams.get("categories")?.split(",");
  const levelsFilterArray = searchParams.get("levels")?.split(",");

  const filtersApplied = useMemo(
    () =>
      (teachersFilterArray?.length ?? 0) +
      (levelsFilterArray?.length ?? 0) +
      (categoriesFilterArray?.length ?? 0),
    [teachersFilterArray, levelsFilterArray, categoriesFilterArray],
  );

  const handleFilterChange = (
    adding: boolean,
    value: string,
    type: "teachers" | "categories" | "levels" | "search",
  ) => {
    console.log({ adding, value, type });
    const params = new URLSearchParams(searchParams);
    const values = params.get(type)?.split(",") ?? [];

    if (adding) {
      values.push(value);
    } else {
      values.splice(values.indexOf(value), 1);
    }

    if (values.length === 0) {
      params.delete(type);
    } else {
      params.set(type, values.join(","));
    }

    const newPathname = `${pathname}?${params.toString()}`;
    history.scrollRestoration = "manual";
    history.pushState(null, "", newPathname);
  };

  const handleSearchKeypress = (search: string) => {
    const params = new URLSearchParams(searchParams);

    if (search === "") {
      params.delete("search");
    } else {
      params.set("search", search);
    }

    const newPathname = `${pathname}?${params.toString()}`;
    history.scrollRestoration = "manual";
    history.pushState(null, "", newPathname);
  };

  const clearFilters = () => {
    history.scrollRestoration = "manual";
    history.pushState(null, "", pathname);
  };

  return {
    searchFilter,
    teachersFilterArray,
    categoriesFilterArray,
    levelsFilterArray,
    clearFilters,
    handleFilterChange,
    handleSearchKeypress,
    filtersApplied,
  };
};
