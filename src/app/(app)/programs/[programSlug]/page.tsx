import { ProgramSpotlight } from "@/components/programs/program-spotlight";

type ProgramsPageProps = {
  params: {
    programSlug: string;
  };
};

const ProgramsPage = async ({ params }: ProgramsPageProps) => {
  // Get the data from the API

  return (
    <div className="header-translate">
      <ProgramSpotlight />
    </div>
  );
};

export default ProgramsPage;
