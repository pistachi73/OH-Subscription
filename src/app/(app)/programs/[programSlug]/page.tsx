import { ProgramSpotlight } from "@/components/programs/program-spotlight";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

type ProgramsPageProps = {
  params: {
    programSlug: string;
  };
};

const ProgramsPage = async ({ params }: ProgramsPageProps) => {
  const program = await api.program.getBySlug.query({
    slug: params.programSlug,
  });

  if (!program) {
    redirect("/");
  }

  return (
    <div className="header-translate">
      <ProgramSpotlight program={program} />
    </div>
  );
};

export default ProgramsPage;
