import { ShotCarousel } from "@/components/shots/shot-carousel";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

type ShotPageProps = {
  params: {
    shotSlug: string;
  };
};

const ShotPage = async ({ params: { shotSlug } }: ShotPageProps) => {
  const { shot, embedding } =
    (await api.shot.getInitialCarouselShot.query({
      initialShotSlug: shotSlug,
    })) ?? {};

  if (!shot || !embedding) {
    redirect("/");
  }

  return (
    <ShotCarousel
      initialShot={{ ...shot, similarity: 1 }}
      embedding={embedding}
    />
  );
};

export default ShotPage;
