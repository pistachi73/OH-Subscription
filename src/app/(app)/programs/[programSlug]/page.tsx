import { ProgramSpotlight } from "@/components/programs/program-spotlight";
import { ProgramSpotlightContextProvider } from "@/components/programs/program-spotlight/program-spotlight-context";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

type ProgramsPageProps = {
  params: {
    programSlug: string;
  };
};

export async function generateMetadata({ params }: ProgramsPageProps) {
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

const ProgramsPage = async ({ params }: ProgramsPageProps) => {
  const program = await api.program.getProgramSpotlight.query({
    slug: params.programSlug,
  });

  if (!program) {
    redirect("/");
  }

  return (
    <ProgramSpotlightContextProvider data={program}>
      <div className="header-translate">
        <ProgramSpotlight />
      </div>
    </ProgramSpotlightContextProvider>
  );
};

export default ProgramsPage;
