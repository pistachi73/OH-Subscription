"use client";

import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { Checkbox } from "@/components/ui/checkbox";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { AnimatePresence, m } from "framer-motion";
import { useProgramsUrlQueryFilters } from "../../hooks/use-programs-url-query-filters";
import { useFilteredPrograms } from "../filtered-programs-context";

type DekstopProgramFiltersProps = {
  isOpen: boolean;
};

export const DesktopProgramFilters = ({
  isOpen,
}: DekstopProgramFiltersProps) => {
  const { levelOptions, categoryOptions, teacherOptions } =
    useFilteredPrograms();

  const {
    teachersFilterArray,
    categoriesFilterArray,
    levelsFilterArray,
    handleFilterChange,
  } = useProgramsUrlQueryFilters();

  return (
    <MaxWidthWrapper className="relative z-10 flex flex-col overflow-hidden mb-6 sm:mb-12">
      <AnimatePresence initial={false} mode="sync">
        {isOpen ? (
          <m.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            transition={{
              type: "spring",
              mass: 1,
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="w-full h-full flex py-8 pt-4 gap-12 flex-wrap">
              <FilterAccordion
                title="Teachers"
                options={teacherOptions}
                filterArray={teachersFilterArray}
                handleFilterChange={handleFilterChange}
                type="teachers"
              />
              <FilterAccordion
                title="Categories"
                options={categoryOptions}
                filterArray={categoriesFilterArray}
                handleFilterChange={handleFilterChange}
                type="categories"
              />
              <FilterAccordion
                title="Levels"
                options={levelOptions}
                filterArray={levelsFilterArray}
                handleFilterChange={handleFilterChange}
                type="levels"
              />
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </MaxWidthWrapper>
  );
};
export const FilterAccordion = ({
  title,
  options,
  filterArray,
  handleFilterChange,
  type,
}: {
  title: string;
  options: Option[];
  type: "teachers" | "categories" | "levels" | "search";
  handleFilterChange: (
    adding: boolean,
    value: string,
    type: "teachers" | "categories" | "levels" | "search",
  ) => void;
  filterArray?: string[];
}) => {
  return (
    <div className="flex flex-col gap-5 py-2 min-w-[200px]">
      <h3 className="w-full py-1 text-lg font-semibold">{title}</h3>
      {options
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(({ label, value, disabled }) => (
          <div key={`${type}-${value}`} className="flex items-center space-x-3">
            <Checkbox
              id={`${type}-${value}`}
              checked={
                disabled
                  ? true
                  : filterArray?.length
                    ? filterArray?.includes(value)
                    : false
              }
              disabled={disabled}
              onCheckedChange={(checked) =>
                handleFilterChange(Boolean(checked), value, type)
              }
              className="disabled:data-[state=checked]:bg-secondary disabled:border-secondary disabled:opacity-100 disabled:cursor-not-allowed"
            />
            <label
              htmlFor={`${type}-${value}`}
              className="peer-disabled:text-foreground disabled:opacity-100 text-base  peer-disabled:cursor-not-allowed  cursor-pointer"
            >
              {label}
            </label>
          </div>
        ))}
    </div>
  );
};
