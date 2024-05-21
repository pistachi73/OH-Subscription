import { Hero } from "@/components/home/hero";
import { ProgramCarousel } from "@/components/ui/carousel/program-carousel";
import { api } from "@/trpc/server";

export default async function Home() {
  const programs = await api.program.getProgramsForCards.query({
    categoryNames: ["Voacabulary"],
  });

  return (
    <div className="header-translate">
      <Hero />
      <ProgramCarousel title="Grammar" href="/" programs={programs} />
      {/* <SeriesCarousel title="News" href="/" />
      <BookCarousel title="Books to read" href="/" />
      <SeriesCarousel title="Learning capsules" href="/" /> */}
    </div>
  );
}
