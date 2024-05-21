import { useState } from "react";

import { ProgramFilter } from "@/components/programs/program-filter/program-filter";
import { CardList } from "@/components/ui/cards/card-list";
import { HeroCard } from "@/components/ui/cards/hero-card";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

const ProgramsSearchPage = () => {
  return (
    <div className="mt-12">
      <MaxWidthWrapper className="relative z-20 mb-12">
        <ProgramFilter />
      </MaxWidthWrapper>
      <MaxWidthWrapper className="grid grid-cols-2  gap-x-2 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <CardList
          cardsPerRow={{
            "2xl": 6,
            xl: 5,
            lg: 4,
            sm: 3,
            xs: 2,
          }}
        />
      </MaxWidthWrapper>
    </div>
  );
};

export default ProgramsSearchPage;
