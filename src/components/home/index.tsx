import { api } from "@/trpc/server";
import { ProgramCarousel } from "../programs/program-carousel";
import { HeroCarousel } from "./hero-carousel";

export const Home = async () => {
  const heroPrograms = await api.program.getProgramsForCards.query({
    limit: 5,
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
    </div>
  );
};
