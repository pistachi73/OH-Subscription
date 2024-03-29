import { Series } from "@/components/series/series";

type SeriesPageProps = {
  params: {
    id: string;
  };
};

const SeriesPage = async ({}: SeriesPageProps) => {
  // Get the data from the API

  return <Series />;
};

export default SeriesPage;
