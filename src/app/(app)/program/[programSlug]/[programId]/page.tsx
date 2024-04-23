import { Program } from "@/components/program/program";

type ProgramsPageProps = {
  params: {
    programSlug: string;
    programId: string;
  };
};

const ProgramsPage = async ({ params }: ProgramsPageProps) => {
  // Get the data from the API

  return <Program />;
};

export default ProgramsPage;
