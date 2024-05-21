"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { type Variants, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import type { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  slidesPerView: number;
  totalItems: number;
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  current?: number;
  total?: number;
  totalItems: number;
  slidesPerView?: number;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      slidesPerView,
      className,
      totalItems,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [current, setCurrent] = React.useState(0);
    const [total, setTotal] = React.useState(0);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());

      setTotal(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);

      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const scrollTo = React.useCallback(
      (index: number) => {
        api?.scrollTo(index);
      },
      [api],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    React.useEffect(() => {
      api?.reInit({ ...opts });
    }, [api, opts]);

    const variants: Variants = {
      initial: {
        zIndex: 1,
        transition: { delay: 0.2, ease: [0, 1, 0, 1] },
      },
      hover: {
        zIndex: 5,
        transition: { delay: 0.3, ease: [0, 1, 0, 1] },
      },
    };

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          slidesPerView,
          current,
          totalItems,
          total,
        }}
      >
        <motion.div
          whileHover="hover"
          whileTap="hover"
          whileFocus="hover"
          whileDrag="hover"
          initial="initial"
          animate="initial"
          variants={variants}
          className="group/carousel relative w-full"
        >
          {orientation === "horizontal" && (
            <div className="absolute -top-2 right-[4%] flex flex-row items-center gap-px 2xl:right-14">
              {Array.from({ length: total }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "h-0.5 w-3 rounded-sm bg-primary-800 opacity-25 transition-opacity",
                    { "opacity-100": current === index + 1 },
                  )}
                />
              ))}
            </div>
          )}
          <div
            ref={ref}
            onKeyDownCapture={handleKeyDown}
            className={cn(
              "relative w-full",

              className,
              {
                "my-1 overflow-x-clip overflow-y-visible px-[2%] sm:px-[4%] 2xl:px-14 ":
                  orientation === "horizontal",
              },
              {
                "overflow-y-clip overflow-x-visible pb-4":
                  orientation === "vertical",
              },
            )}
            role="region"
            aria-roledescription="carousel"
            {...props}
          >
            {children}
          </div>
        </motion.div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef}>
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal"
            ? "-ml-1  lg:-ml-2 xl:-ml-3"
            : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-1 lg:pl-2 xl:pl-3" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "ghost", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "group/chevron-prev absolute flex h-full w-[calc(4%-4px)]  items-center  justify-center rounded-none rounded-r-sm bg-muted-background/50 opacity-100  transition-opacity",
        "hover:bg-muted-background/60",
        "disabled:opacity-0",
        "group-hover/carousel:opacity-100 group-hover/carousel:disabled:opacity-0",
        "lg:w-[calc(4%-8px)]",
        "xl:w-[calc(4%-12px)]",
        "2xl:w-[48px]",
        orientation === "horizontal"
          ? "-left-0 top-1/2 -translate-y-1/2"
          : "-top-10 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft
        className={cn(
          "text-foreground/50 opacity-0 transition-transform",
          "group-hover/chevron-prev:scale-[1.2]  group-hover/carousel:opacity-100",
        )}
        size={32}
      />
      <span className="sr-only">Previous slide</span>
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "default", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "group/chevron-next absolute flex h-full w-[calc(4%-4px)] items-center justify-center rounded-none rounded-l-sm bg-muted-background/50 opacity-100  transition-opacity",
        "hover:bg-muted-background/60",
        "disabled:opacity-0",
        "group-hover/carousel:opacity-100 group-hover/carousel:disabled:opacity-0",
        "lg:w-[calc(4%-8px)]",
        "xl:w-[calc(4%-12px)]",
        "2xl:w-[48px]",
        orientation === "horizontal"
          ? "-right-0 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",

        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight
        className={cn(
          "text-foreground/50 opacity-0 transition-transform",
          "group-hover/chevron-next:scale-[1.2]  group-hover/carousel:opacity-100",
        )}
        size={32}
      />
      <span className="sr-only">Next slide</span>
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
