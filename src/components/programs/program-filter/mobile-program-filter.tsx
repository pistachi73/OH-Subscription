"use client";
import { Filter, FilterX, RotateCcw, Search } from "lucide-react";
import { useState } from "react";

import { useFilteredPrograms } from "./filtered-programs-context";
import { useProgramFilters } from "./use-program-filters";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
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
    teachers,
    categories,
    levels,
    search,
    handleFilterChange,
    clearFilters,
    handleSearchKeypress,
  } = useProgramFilters();

  const [searchInput, setSearchInput] = useState(search ?? "");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-12 w-full shadow-md">
          <Filter size={24} className="mr-2" />
          Filter Programs
        </Button>

        {/* <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Filter Programs</CardTitle>
            <CardDescription>
              Filter programs by teachers, categories, and levels
            </CardDescription>
          </CardHeader>
        </Card> */}
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] space-y-4 overflow-y-auto">
        <SheetHeader className="p-0 text-left">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            Filter programs
          </SheetTitle>
        </SheetHeader>

        <div className="relative h-10 w-full items-center rounded-sm ">
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
            disabled={isFiltering}
            value={searchInput}
          />
        </div>
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold">Teachers:</h3>
            {teacherOptions.map(({ label, value }) => (
              <div
                key={`teacher-${value}`}
                className="flex cursor-pointer items-center space-x-2"
              >
                <Checkbox
                  id={`teacher-${value}`}
                  checked={teachers ? teachers?.includes(value) : false}
                  onCheckedChange={(checked) =>
                    handleFilterChange(Boolean(checked), value, "teachers")
                  }
                />
                <label
                  htmlFor={`teacher-${value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold">Categories:</h3>
            {categoryOptions.map(({ label, value }) => (
              <div
                key={`category-${value}`}
                className="flex cursor-pointer items-center space-x-2"
              >
                <Checkbox
                  id={`category-${value}`}
                  checked={categories ? categories?.includes(value) : false}
                  onCheckedChange={(checked) => {
                    console.log({ checked, value, label });
                    handleFilterChange(Boolean(checked), value, "categories");
                  }}
                />
                <label
                  htmlFor={`category-${value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold">Level:</h3>
            {levelOptions.map(({ label, value }) => (
              <div
                key={`level-${value}`}
                className="flex cursor-pointer items-center space-x-2"
              >
                <Checkbox
                  id={`level-${value}`}
                  checked={levels ? levels?.includes(value) : false}
                  onCheckedChange={(checked) =>
                    handleFilterChange(Boolean(checked), value, "levels")
                  }
                />
                <label
                  htmlFor={`level-${value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {(teachers?.length || levels?.length || categories?.length) && (
          <Button
            variant="ghost"
            onClick={() => clearFilters()}
            size="sm"
            className={cn(
              "fixed bottom-0 left-0 right-0 flex h-10 w-[300px] items-center justify-start gap-2 rounded-none border-destructive bg-background px-6 text-destructive ",
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
