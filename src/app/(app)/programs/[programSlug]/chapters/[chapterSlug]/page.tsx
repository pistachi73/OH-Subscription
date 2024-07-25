import { Chapter } from "@/components/chapter/index";
import { redirect } from "next/navigation";

type ChapterPageProps = {
  params: {
    programSlug: string;
    chapterSlug: string;
  };
};

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
