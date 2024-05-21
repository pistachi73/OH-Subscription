import { ShotCarousel } from "@/components/ui/shot/shot-carousel";

type ShotPageProps = {
  params: {
    shotId: string;
  };
};

const ShotPage = ({ params: { shotId } }: ShotPageProps) => {
  // fetch shots

  return <ShotCarousel currentShot={parseInt(shotId, 10)} />;
};

export default ShotPage;
