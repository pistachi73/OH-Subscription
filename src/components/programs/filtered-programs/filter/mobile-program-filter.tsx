"use client";
import { Filter, FilterX, X } from "lucide-react";
import { useState } from "react";

import { useProgramsUrlQueryFilters } from "../../hooks/use-programs-url-query-filters";
import { useFilteredPrograms } from "../filtered-programs-context";

import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/ui/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const MobileProgramFilter = () => {
  const { levelOptions, categoryOptions, teacherOptions, isFiltering } =
    useFilteredPrograms();

  const {
    teachersFilterArray,
    categoriesFilterArray,
    levelsFilterArray,
    searchFilter,
    handleFilterChange,
    clearFilters,
    handleSearchKeypress,
  } = useProgramsUrlQueryFilters();

  const [searchInput, setSearchInput] = useState(searchFilter ?? "");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline" className="h-10 w-full shadow-sm text-sm">
          <Filter size={18} className="mr-2" />
          Filter programs
        </Button>
      </SheetTrigger>
      <SheetContent
        hideClose
        side="right"
        className="w-[320px] overflow-y-auto p-0 pb-14"
      >
        <SheetHeader className="text-left p-4 py-6">
          <SheetTitle className="text-xl font-semibold tracking-tight flex flex-row items-center justify-between">
            Filter
            <Button
              variant="ghost"
              className="pr-0 text-foreground/80 hover:text-foreground p-0 h-6 w-6 -mr-1"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {/* <div className="relative h-10 w-full items-center rounded-sm ">
            <Search
              className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 transform text-foreground"
              size={16}
            />
            <Input
              autoFocus={false}
              placeholder="Title, description..."
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchKeypress(searchInput);
                }
              }}
              className="h-10 w-full  bg-transparent px-0 py-0 pl-10 text-sm ease-out"
              disabled={isFiltering}
              value={searchInput}
            />
          </div> */}
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

        {(teachersFilterArray?.length ||
          levelsFilterArray?.length ||
          categoriesFilterArray?.length) && (
          <Button
            variant="ghost"
            onClick={() => clearFilters()}
            size="sm"
            className={cn(
              "fixed bottom-0 right-0 border-l border-border flex h-10 w-[320px] items-center justify-start gap-2 rounded-none bg-background px-6 text-destructive ",
              "hover:border-destructive hover:bg-destructive hover:text-destructive-foreground",
            )}
          >
            <FilterX size={16} />
            Clear filters
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};

const FilterAccordion = ({
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 py-5 px-4 border-t border-accent">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full py-1"
        type="button"
      >
        <h3 className="text-base font-semibold">{title}</h3>
        {isOpen ? (
          <ChevronUpIcon className="text-foreground/80 w-4 h-4" />
        ) : (
          <ChevronDownIcon className="text-foreground/80 w-4 h-4" />
        )}
      </button>

      {isOpen &&
        options.map(({ label, value }) => (
          <div
            key={`${type}-${value}`}
            className="flex cursor-pointer items-center space-x-3"
          >
            <Checkbox
              id={`${type}-${value}`}
              checked={
                filterArray?.length ? filterArray?.includes(value) : false
              }
              onCheckedChange={(checked) =>
                handleFilterChange(Boolean(checked), value, type)
              }
            />
            <label
              htmlFor={`${type}-${value}`}
              className="text-accent-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          </div>
        ))}
    </div>
  );
};
