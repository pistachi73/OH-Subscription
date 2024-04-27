import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { Shot } from "@/components/ui/shot/shot";

const ShotsPage = () => {
  return (
    <div className="mx-auto flex max-h-[calc(100vh-var(--header-height))] w-full items-center justify-center">
      <Carousel
        className=""
        orientation="vertical"
        slidesPerView={1}
        totalItems={4}
        opts={{
          align: "center",
          startIndex: 0,
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="max-h-[calc(100vh-var(--header-height))] ">
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              <CarouselItem
                key={index}
                className={"flex basis-full justify-center"}
              >
                <div
                  key={index}
                  className=" flex aspect-[9/16] w-[calc(90vh*9/16)] items-center justify-center bg-muted"
                >
                  <p className="text-3xl">{index + 1}</p>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
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
