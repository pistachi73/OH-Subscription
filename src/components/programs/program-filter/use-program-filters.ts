import { usePathname, useSearchParams } from "next/navigation";

export const useProgramFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const search = searchParams.get("search");
  const teachers = searchParams.get("teachers")?.split(",");
  const categories = searchParams.get("categories")?.split(",");
  const levels = searchParams.get("levels")?.split(",");

  const handleFilterChange = (
    adding: boolean,
    value: string,
    type: "teachers" | "categories" | "levels" | "search",
  ) => {
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
    // window.scrollTo({ top: 0, behavior: "smooth" });
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
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    history.scrollRestoration = "manual";
    history.pushState(null, "", pathname);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    search,
    teachers,
    categories,
    levels,
    clearFilters,
    handleFilterChange,
    handleSearchKeypress,
  };
};
