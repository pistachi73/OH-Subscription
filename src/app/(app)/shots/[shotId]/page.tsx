import { ShotCarousel } from "@/components/shots/shot-carousel";

type ShotPageProps = {
  params: {
    shotId: string;
  };
};

const ShotPage = ({ params: { shotId } }: ShotPageProps) => {
  // fetch shots

  return <ShotCarousel currentShot={Number.parseInt(shotId, 10)} />;
};

export default ShotPage;
