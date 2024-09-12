import { Chapter } from "@/components/chapter/index";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

type ChapterPageProps = {
  params: {
    programSlug: string;
    chapterSlug: string;
  };
};

export async function generateMetadata({ params }: ChapterPageProps) {
  const program = await api.program.getProgramSpotlight.query({
    slug: params.programSlug,
  });

  if (!program) {
    return null;
  }

  return {
    title: program.title,
    description: program.description,
    keywords:
      "educational programs, program filter, search programs, categories, teachers, levels",
  };
}

const ChapterPage = async ({ params }: ChapterPageProps) => {
  if (!params.programSlug || !params.chapterSlug) {
    redirect("/");
  }

  return (
    <Chapter
      chapterSlug={params.chapterSlug}
      programSlug={params.programSlug}
    />
  );
};

export default ChapterPage;
