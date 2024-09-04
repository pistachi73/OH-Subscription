import { api } from "@/trpc/server";
import { ProgramCarousel } from "../programs/program-carousel";
import { ShotList } from "../shots/shot-list";
import { TeacherCarousel } from "../teachers/teacher-carousel";
import { HeroCarousel } from "./hero-carousel";

export const Home = async () => {
  const [programs, shots, teachers] = await Promise.all([
    api.program.getProgramCards.query(),
    api.shot.getShotCards.query(),
    api.teacher.getLandingPageTeachers.query(),
  ]);

  const heroPrograms = [...programs].slice(0, 5);

  const vocabularyPrograms = programs.filter((p) =>
    p.categories?.some((c) => c.slug === "vocabulary"),
  );

  const grammarPrograms = programs.filter((p) =>
    p.categories?.some((c) => c.slug === "grammar"),
  );

  return (
    <div className="header-translate">
      {/* <div className="my-[300px] flex flex-row gap-3 items-center justify-center">
        <div className="group size-[200px] bg-primary hover:bg-primary-hover flex items-center justify-center">
          <p className="text-primary-foreground">Test text</p>
        </div>
        <div className="group size-[200px] bg-muted hover:bg-muted-hover flex items-center justify-center">
          <p className="text-mtbg-muted-foreground">Test text</p>
        </div>
        <div className="group size-[200px] bg-accent hover:bg-accent-hover flex items-center justify-center">
          <p className="text-accent-foreground">Test text</p>
        </div>

        <div className="group size-[200px] bg-secondary hover:bg-secondary-hover flex items-center justify-center">
          <p className="text-secondary-foreground">Test text</p>
        </div>
        <div className="group size-[200px] bg-destructive hover:bg-destructive-hover flex items-center justify-center">
          <p className="text-destructive-foreground">Test text</p>
        </div>
      </div> */}
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

      <TeacherCarousel title="Meet the teachers" teachers={teachers} />
    </div>
  );
};
