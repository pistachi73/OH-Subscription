"use client";
import { FilterX, X } from "lucide-react";
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
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, m } from "framer-motion";

type MobileProgramFilterProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MobileProgramFilter = ({
  isOpen,
  setIsOpen,
}: MobileProgramFilterProps) => {
  const { levelOptions, categoryOptions, teacherOptions } =
    useFilteredPrograms();

  const {
    filtersApplied,
    teachersFilterArray,
    categoriesFilterArray,
    levelsFilterArray,
    handleFilterChange,
    clearFilters,
  } = useProgramsUrlQueryFilters();

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
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

        {filtersApplied ? (
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
        ) : null}
      </SheetContent>
    </Sheet>
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col  py-5 px-4 border-t border-accent overflow-hidden">
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

      <AnimatePresence initial={false}>
        {isOpen && (
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
            <div className="mt-5 flex flex-col gap-5">
              {options
                .sort((a, b) => a.label.localeCompare(b.label))
                .map(({ label, value, disabled }) => (
                  <div
                    key={`${type}-${value}`}
                    className="flex cursor-pointer items-center space-x-3"
                  >
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
                      className="peer-disabled:text-foreground disabled:opacity-100 text-sm  peer-disabled:cursor-not-allowed  cursor-pointer"
                    >
                      {label}
                    </label>
                  </div>
                ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
