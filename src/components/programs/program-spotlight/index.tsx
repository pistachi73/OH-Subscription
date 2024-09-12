import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgramChapterList } from "./program-chapter-list";
import { ProgramCommunity } from "./program-community";
import { RelatedPrograms } from "./program-related";
import { ProgramSpotlightHero } from "./program-spotlight-hero";

export const ProgramSpotlight = () => {
  return (
    <>
      <ProgramSpotlightHero />
      <Tabs defaultValue="chapters" className="w-full">
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
          <ProgramChapterList />
        </TabsContent>
        <TabsContent value="similar">
          <RelatedPrograms />
        </TabsContent>
        <TabsContent value="community">
          <ProgramCommunity />
        </TabsContent>
      </Tabs>
    </>
  );
};
