import { Chapter } from "@/components/chapters/chapter";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

type ChapterPageProps = {
  params: {
    programSlug: string;
    chapterSlug: string;
  };
};

const ChapterPage = async ({ params }: ChapterPageProps) => {
  // Get chapter info

  const program = await api.program.getBySlug.query({
    slug: params.programSlug,
  });

  if (!program) {
    redirect("/");
  }

  const chapter = await api.video.getBySlug.query({
    videoSlug: params.chapterSlug,
    programId: program.id,
  });

  if (!chapter) {
    redirect("/");
  }

  return <Chapter chapter={chapter} program={program} />;
};

export default ChapterPage;
