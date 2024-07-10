"use client";

import { AnimatePresence, m } from "framer-motion";
import {
  BookUser,
  ChevronDown,
  Filter,
  Layers3,
  RotateCcw,
  Search,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import { FilterBadgesList } from "./filter-badge";
import { useFilteredPrograms } from "./filtered-programs-context";
import { useProgramFilters } from "./use-program-filters";
import { getMappedOptions } from "./utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { regularEase } from "@/lib/animation";
import { cn } from "@/lib/utils";

export const DesktopProgramFilter = () => {
  const { levelOptions, categoryOptions, teacherOptions, isFiltering } =
    useFilteredPrograms();

  const {
    teachers,
    categories,
    levels,
    search,
    handleFilterChange,
    clearFilters,
    handleSearchKeypress,
  } = useProgramFilters();

  useEffect(() => {
    setSearchInput(search ?? "");
  }, [search]);

  const [searchInput, setSearchInput] = useState(search ?? "");

  const mappedTeachers = getMappedOptions(teacherOptions);
  const mappedCategories = getMappedOptions(categoryOptions);
  const mappedLevels = getMappedOptions(levelOptions);
  return (
    <Card className="flex flex-col rounded-md shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 p-4 pb-2 sm:p-5 sm:pb-4">
        <div className="flex items-center gap-4">
          <CardTitle className="text-xl">Filter Programs</CardTitle>
          {/* <CardDescription className="hidden text-sm lg:block">
          Adjust the filters to find the right program for you
        </CardDescription> */}
        </div>

        <div className="relative h-10 w-[300px] items-center rounded-sm ">
          <Search
            className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 transform text-foreground"
            size={16}
          />
          <Input
            placeholder="Title, description..."
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchKeypress(searchInput);
              }
            }}
            className="h-10 w-full  bg-transparent px-0 py-0 pl-10 text-sm ease-out"
            // disabled={isFiltering}
            value={searchInput}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div
          className={cn("flex flex-row flex-wrap items-center gap-4 gap-y-2")}
        >
          <Filter
            size={22}
            className="hidden shrink-0 fill-primary stroke-primary sm:block"
          />
          {teacherOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-10  grow justify-between gap-2"
                  // disabled={isFiltering}
                >
                  <div className="flex shrink items-center overflow-hidden text-ellipsis">
                    <BookUser className="mr-2 h-4 w-4 shrink-0" />
                    <span className="overflow-hidden text-ellipsis">
                      Teacher {teachers?.length && `(${teachers?.length})`}
                    </span>
                  </div>
                  <ChevronDown size={16} className="shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                <DropdownMenuLabel>Select teacher</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {teacherOptions.map(({ label, value }) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={value}
                      className="capitalize"
                      checked={teachers?.includes(value)}
                      onCheckedChange={(adding) =>
                        handleFilterChange(adding, value, "teachers")
                      }
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {levelOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-10  grow justify-between"
                  // disabled={isFiltering}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Level {levels?.length && `(${levels?.length})`}
                  </div>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                <DropdownMenuLabel>Select level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {levelOptions.map(({ label, value }) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={value}
                      className="capitalize"
                      checked={levels?.includes(value)}
                      onCheckedChange={(adding) =>
                        handleFilterChange(adding, value, "levels")
                      }
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {categoryOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-10  grow justify-between"
                  // disabled={isFiltering}
                >
                  <div className="flex items-center space-x-2">
                    <Layers3 className="mr-2 h-4 w-4" />
                    Category {categories?.length && `(${categories?.length})`}
                  </div>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                <DropdownMenuLabel>Select categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categoryOptions.map(({ label, value }) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={value}
                      className="capitalize"
                      checked={categories?.includes(value)}
                      onCheckedChange={(adding) =>
                        handleFilterChange(adding, value, "categories")
                      }
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <AnimatePresence initial={false}>
          {(teachers?.length || levels?.length || categories?.length) && (
            <m.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: regularEase }}
            >
              <div className="mt-4 flex flex-row flex-wrap items-center gap-2">
                <div className="flex flex-row flex-wrap items-center gap-2">
                  <FilterBadgesList
                    title="Teachers"
                    list={teachers}
                    mappedValues={mappedTeachers}
                    onRemove={(value) =>
                      handleFilterChange(false, value, "teachers")
                    }
                  />
                  <FilterBadgesList
                    title="Levels"
                    list={levels}
                    mappedValues={mappedLevels}
                    onRemove={(value) =>
                      handleFilterChange(false, value, "levels")
                    }
                  />
                  <FilterBadgesList
                    title="Categories"
                    list={categories}
                    mappedValues={mappedCategories}
                    onRemove={(value) =>
                      handleFilterChange(false, value, "categories")
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex h-8 items-center gap-2 border-destructive bg-background text-destructive ",
                      "hover:border-destructive hover:bg-destructive hover:text-destructive-foreground",
                    )}
                    onClick={() => clearFilters()}
                  >
                    <RotateCcw size={16} />
                    Clear filters
                  </Button>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
