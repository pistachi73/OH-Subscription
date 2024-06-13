import { api } from "@/trpc/server";
import { ProgramCarousel } from "../programs/program-carousel";
import { ShotList } from "../shots/shot-list";
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

  const shots = await api.shot.getShotForCards.query();

  return (
    <div className="header-translate">
      <HeroCarousel programs={heroPrograms} />
      <ProgramCarousel
        title="Grammar"
        href="/programs/?categories=4"
        programs={grammarPrograms}
      />
      <ShotList shots={shots} />
      <ProgramCarousel
        title="Vocabulary"
        href="/programs/?categories=3"
        programs={vocabularyPrograms}
      />
    </div>
  );
};
