import { HeroCarousel } from "@/components/home/hero-carousel";
import { ProgramCarousel } from "@/components/programs/program-carousel";
import { api } from "@/trpc/server";

export default async function Home() {
  const heroPrograms = await api.program.getProgramsForCards.query({
    limit: 20,
  });

  const vocabularyPrograms = await api.program.getProgramsForCards.query({
    categoryNames: ["Voacabulary"],
  });

  const grammarPrograms = await api.program.getProgramsForCards.query({
    categoryNames: ["Grammar"],
  });

  return (
    <div className="header-translate">
      <HeroCarousel programs={heroPrograms} />
      <ProgramCarousel
        title="Grammar"
        href="/programs/?categories=4"
        programs={grammarPrograms}
      />
      {/* <ShotList /> */}
      <ProgramCarousel
        title="Vocabulary"
        href="/programs/?categories=3"
        programs={vocabularyPrograms}
      />
      {/* <SeriesCarousel title="News" href="/" />
      <BookCarousel title="Books to read" href="/" />
      <SeriesCarousel title="Learning capsules" href="/" /> */}
    </div>
  );
}
