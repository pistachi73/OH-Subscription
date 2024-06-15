import { ShotCarousel } from "@/components/shots/shot-carousel";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

type ShotPageProps = {
  params: {
    shotSlug: string;
  };
};

const ShotPage = async ({ params: { shotSlug } }: ShotPageProps) => {
  const initialShot = await api.shot.getCarouselShots.query({
    initialShotSlug: shotSlug,
  });

  if (!initialShot[0]) {
    redirect("/");
  }

  console.log({ initialShot });

  return <ShotCarousel initialShots={initialShot} />;
};

export default ShotPage;
