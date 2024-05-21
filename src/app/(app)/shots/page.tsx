import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { Shot } from "@/components/ui/shot/shot";
import { ShotPlayer } from "@/components/ui/video-players/shot-player";

const ShotsPage = () => {
  return (
    <div className="mx-auto mt-12 flex max-h-[80vh] w-[400px] items-center justify-center">
      <ShotPlayer />
    </div>
  );
};

export default ShotsPage;

// <div className="mx-auto flex h-[calc(100vh-var(--header-height))] w-full items-center justify-center pt-8">
{
  /* <
  Carousel
        className="w-[500px]"
        orientation="
        "
        opts={{
          startIndex: 0,
          slidesToScroll: 1,
        }}
      >
        <
        CarouselContent className="h-full">
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              <
              CarouselItem key={index} className={"basis-1/2"}>
                <div key={index} className=" aspect-[9/16] w-full  bg-muted">
                  {index + 1}
                </div>
              </
              CarouselItem>
            );
          })}
        </
        CarouselContent>
      </
      Carousel> */
}
