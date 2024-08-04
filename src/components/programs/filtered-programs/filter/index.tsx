"use client";

import { DeviceOnly } from "@/components/ui/device-only/device-only";
import { FilterIcon } from "@/components/ui/icons";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { useState } from "react";
import { useProgramsUrlQueryFilters } from "../../hooks/use-programs-url-query-filters";
import { DesktopProgramFilters } from "./dekstop-filter";
import { MobileProgramFilter } from "./mobile-filter";

export const ProgramFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { filtersApplied, clearFilters } = useProgramsUrlQueryFilters();
  return (
    <section className="mb-8 mt-6  md:mb-10 md:mt-8">
      <MaxWidthWrapper
        as="section"
        className="relative z-10 border-y border-border flex flex-col  py-3 overflow-hidden"
      >
        <div className="flex flex-row items-center justify-between h-full">
          <div className="flex gap-8 items-center h-full py-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-0  font-medium flex items-center gap-2 text-base text-foreground/80 hover:text-foreground transition-colors"
              type="button"
            >
              <FilterIcon className="w-6 h-6" />
              Apply Filters {filtersApplied ? `(${filtersApplied})` : ""}
            </button>
            {filtersApplied ? (
              <>
                <div className="w-0.5 h-5 bg-border" />
                <button
                  onClick={clearFilters}
                  className="px-0 flex items-center gap-2 text-muted-foreground text-base hover:underline"
                  type="button"
                >
                  Clear all
                </button>
              </>
            ) : null}
          </div>
        </div>
      </MaxWidthWrapper>

      <DeviceOnly allowedDevices={["desktop", "tablet"]}>
        <DesktopProgramFilters isOpen={isOpen} />
      </DeviceOnly>
      <DeviceOnly allowedDevices={["mobile"]}>
        <MobileProgramFilter isOpen={isOpen} setIsOpen={setIsOpen} />
      </DeviceOnly>
    </section>
  );
};
