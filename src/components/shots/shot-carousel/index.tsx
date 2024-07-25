"use client";

import { useEffect, useMemo, useState } from "react";

import type { VerticalCarouselApi } from "@/components/ui/vertical-carousel";
import type { ShotCarouselData } from "@/server/db/schema.types";
import { api as trpcApi } from "../../../trpc/react";
import { Shot } from "../shot";
import { LoadingShot } from "../shot/loading-shot";
import { CarouselContainer } from "./carousel-container";
import { CarouselItem } from "./carousel-item";

type ShotCarouselProps = {
  initialShot: ShotCarouselData;
  embedding: number[];
  className?: string;
};

export const ShotCarousel = ({ initialShot, className }: ShotCarouselProps) => {
  const [api, setApi] = useState<VerticalCarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpcApi.shot.getCarouselShots.useInfiniteQuery(
      {
        initialShotSlug: initialShot.slug,
        initialShotTitle: initialShot.title,
        pageSize: 3,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnMount: false,
      },
    );

  const shots = useMemo(
    () => [initialShot, ...(data?.pages.flatMap((page) => page.shots) ?? [])],
    [data, initialShot],
  );

  useEffect(() => {
    if (!shots?.[current]) return;

    window.history.pushState(null, "", `/shots/${shots?.[current]?.slug}/`);

    if (current === shots.length - 1 && hasNextPage) {
      fetchNextPage();
    }
  }, [current, shots, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <CarouselContainer setApi={setApi}>
      {shots?.map((shot, index) => {
        if (!shot) return null;
        return (
          <CarouselItem key={shot.slug}>
            <Shot shot={shot} inView={current === index} />
          </CarouselItem>
        );
      })}

      {isFetchingNextPage && (
        <CarouselItem>
          <LoadingShot />
        </CarouselItem>
      )}
    </CarouselContainer>
  );
};
