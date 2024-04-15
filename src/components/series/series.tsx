import { MaxWidthWrapper } from "../ui/max-width-wrapper";

import { Chapters } from "./chapters";
import { Community } from "./community";
import { SeriesHeroCard } from "./series-hero-card";
import { SimilarSeries } from "./similar-series";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Series = () => {
  return (
    <>
      <SeriesHeroCard />
      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="flex w-full items-center justify-center">
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="similar">Similar</TabsTrigger>
          {/* <TabsTrigger value="details">Details</TabsTrigger> */}
        </TabsList>
        <TabsContent value="chapters">
          <Chapters />
        </TabsContent>

        <TabsContent value="similar">
          <MaxWidthWrapper>
            <SimilarSeries />
          </MaxWidthWrapper>
        </TabsContent>
        <TabsContent value="community">
          <Community />
        </TabsContent>
        {/* <TabsContent value="details">Change your email here.</TabsContent> */}
      </Tabs>
    </>
  );
};
