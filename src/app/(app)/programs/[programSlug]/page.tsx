import { Program } from "@/components/programs/program-spotlight";

type ProgramsPageProps = {
  params: {
    programSlug: string;
  };
};

const ProgramsPage = async ({ params }: ProgramsPageProps) => {
  // Get the data from the API

  return (
    <div className="header-translate">
      <Program />
    </div>
  );
};

export default ProgramsPage;
