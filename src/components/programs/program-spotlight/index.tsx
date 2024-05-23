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
      <MaxWidthWrapper className="max-w-[1400px]">
        <Tabs defaultValue="chapters" className="w-full mt-8">
          <TabsList className="flex w-full items-center justify-center text-base">
            <TabsTrigger value="chapters" className="text-base">
              Chapters
            </TabsTrigger>
            <TabsTrigger value="community" className="text-base">
              Community
            </TabsTrigger>
            <TabsTrigger value="similar" className="text-base">
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
