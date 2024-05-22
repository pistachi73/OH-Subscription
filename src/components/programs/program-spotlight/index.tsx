import { ProgramChapterList } from "./program-chapter-list";
import { ProgramCommunity } from "./program-community";
import { SimilarPrograms } from "./program-similars";
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
        <Tabs defaultValue="chapters" className="w-full">
          <TabsList className="flex w-full items-center justify-center">
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
          </TabsList>
          <TabsContent value="chapters">
            <ProgramChapterList chapters={program.chapters} />
          </TabsContent>

          <TabsContent value="similar">
            <SimilarPrograms />
          </TabsContent>
          <TabsContent value="community">
            <ProgramCommunity />
          </TabsContent>
        </Tabs>
      </MaxWidthWrapper>
    </>
  );
};
