import { api } from "@/trpc/server";
import { ProgramCarousel } from "../programs/program-carousel";
import { ShotList } from "../shots/shot-list";
import { TeacherCarousel } from "../teachers/teacher-carousel";
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
    <div className="header-translate">
      <HeroCarousel programs={heroPrograms} />

      <ProgramCarousel
        title="Vocabulary"
        href="/programs/?categories=3"
        programs={vocabularyPrograms}
        priority
      />

      <ShotList shots={shots} />
      <ProgramCarousel
        title="Grammar"
        href="/programs/?categories=4"
        programs={grammarPrograms}
        priority
      />
      {/* <ShotList shots={shots} /> */}

      <TeacherCarousel
        title="Meet the teachers"
        teachers={[
          {
            id: 1,
            name: "John Doe",
            image: "https://source.unsplash.com/random/100x100",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula.",
          },
          {
            id: 2,
            name: "John Doe",
            image: "https://source.unsplash.com/random/100x100",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula.",
          },
          {
            id: 3,
            name: "John Doe",
            image: "https://source.unsplash.com/random/100x100",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula.",
          },
          {
            id: 4,
            name: "John Doe",
            image: "https://source.unsplash.com/random/100x100",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula.",
          },
          {
            id: 5,
            name: "John Doe",
            image: "https://source.unsplash.com/random/100x100",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula.",
          },
        ]}
      />
    </div>
  );
};
