import type { RouterOutputs } from "@/trpc/shared";

export type ProgramSpotlight = RouterOutputs["program"]["getBySlug"];
export type ProgramCard = RouterOutputs["program"]["getProgramsForCards"][0];

// VIDEOS
export type Chapter = RouterOutputs["video"]["getBySlug"];

// SHOTS
export type ShotCard = RouterOutputs["shot"]["getLandingPageShots"][0];
export type ShotCarousel =
  RouterOutputs["shot"]["getCarouselShots"]["shots"][0];
export type AdminShot = RouterOutputs["shot"]["_getById"];

// COMMENTS
export type ApiComment =
  RouterOutputs["comment"]["getBySourceId"]["comments"][0];
