"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowDown, ArrowUp } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VerticalCarouselApi = UseEmblaCarouselType[1];
type UseVerticalCarouselParameters = Parameters<typeof useEmblaCarousel>;
type VerticalCarouselOptions = UseVerticalCarouselParameters[0];
type VerticalCarouselPlugin = UseVerticalCarouselParameters[1];

type VerticalCarouselProps = {
  opts?: VerticalCarouselOptions;
  plugins?: VerticalCarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: VerticalCarouselApi) => void;
};

type VerticalCarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & VerticalCarouselProps;

const VerticalCarouselContext =
  React.createContext<VerticalCarouselContextProps | null>(null);

function useVerticalCarousel() {
  const context = React.useContext(VerticalCarouselContext);

  if (!context) {
    throw new Error(
      "useVerticalCarousel must be used within a <VerticalCarousel />",
    );
  }

  return context;
}

const VerticalCarousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VerticalCarouselProps
>(
  (
    {
      orientation = "vertical",
      opts,
      setApi,
      plugins,
      className,
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
      [...(plugins ?? [])],
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: VerticalCarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

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

    return (
      <VerticalCarouselContext.Provider
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
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            "relative  overflow-y-clip overflow-x-visible",
            className,
          )}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </VerticalCarouselContext.Provider>
    );
  },
);
VerticalCarousel.displayName = "Carousel";

const VerticalCarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useVerticalCarousel();

  return (
    <div ref={carouselRef} className="h-full overflow-hidden">
      <div
        ref={ref}
        className={cn(" flex flex-col", "sm:-mt-4", className)}
        {...props}
      />
    </div>
  );
});
VerticalCarouselContent.displayName = "VerticalCarouselContent";

const VerticalCarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useVerticalCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", "sm:pt-4", className)}
      {...props}
    />
  );
});
VerticalCarouselItem.displayName = "VerticalCarouselItem";

const VerticalCarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useVerticalCarousel();

  return (
    <Button
      ref={ref}
      variant={"secondary"}
      className={cn(
        "absolute h-14 w-14 rounded-full transition-all",
        "right-8 top-0",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowUp size={22} />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
VerticalCarouselPrevious.displayName = "VerticalCarouselPrevious";

const VerticalCarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useVerticalCarousel();

  return (
    <Button
      ref={ref}
      variant={"secondary"}
      className={cn(
        "absolute h-14 w-14 rounded-full transition-all",
        "bottom-8 right-8",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowDown size={22} />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
VerticalCarouselNext.displayName = "VerticalCarouselNext";

export {
  type VerticalCarouselApi,
  VerticalCarousel,
  VerticalCarouselContent,
  VerticalCarouselItem,
  VerticalCarouselPrevious,
  VerticalCarouselNext,
};
