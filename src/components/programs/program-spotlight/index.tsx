import { ProgramChapterList } from "./program-chapter-list";
import { ProgramCommunity } from "./program-community";
import { RelatedPrograms } from "./program-related";
import { ProgramSpotlightHero } from "./program-spotlight-hero";

import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProgramSpotlight as ProgramSpotlightType } from "@/server/db/schema.types";

type ProgramSpotlightProps = {
  program: NonNullable<ProgramSpotlightType>;
};

export const ProgramSpotlight = ({ program }: ProgramSpotlightProps) => {
  return (
    <>
      <ProgramSpotlightHero program={program} />
      <MaxWidthWrapper>
        <Tabs
          defaultValue="chapters"
          className="w-full"
          layoutId="program-spotligh-tabs"
        >
          <TabsList className="flex w-full items-center justify-center text-base my-8 sm:my-12">
            <TabsTrigger value="chapters" className="text-sm sm:text-base">
              Chapters
            </TabsTrigger>
            <TabsTrigger value="community" className="text-sm sm:text-base">
              Community
            </TabsTrigger>
            <TabsTrigger value="similar" className="text-sm sm:text-base">
              Similar
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chapters">
            <ProgramChapterList program={program} />
          </TabsContent>

          <TabsContent value="similar">
            <RelatedPrograms program={program} />
          </TabsContent>
          <TabsContent value="community">
            <ProgramCommunity program={program} />
          </TabsContent>
        </Tabs>
      </MaxWidthWrapper>
    </>
  );
};
