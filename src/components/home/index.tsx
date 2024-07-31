import { api } from "@/trpc/server";
import { ProgramCarousel } from "../programs/program-carousel";
import { HeroCarousel } from "./hero-carousel";

export const Home = async () => {
  const [heroPrograms, vocabularyPrograms, grammarPrograms, shots] =
    await Promise.all([
      api.program.getProgramsForCards.query({
        limit: 5,
      }),
      api.program.getProgramsForCards.query({
        categoryNames: ["Voacabulary"],
      }),
      api.program.getProgramsForCards.query({
        categoryNames: ["Grammar"],
      }),
      api.shot.getShotForCards.query(),
    ]);

  return (
    <div>
      <HeroCarousel programs={heroPrograms} />
      <ProgramCarousel
        title="Vocabulary"
        href="/programs/?categories=3"
        programs={vocabularyPrograms}
      />
      {/* <ShotList shots={shots} /> */}
      <ProgramCarousel
        title="Grammar"
        href="/programs/?categories=4"
        programs={grammarPrograms}
      />
    </div>
  );
};
