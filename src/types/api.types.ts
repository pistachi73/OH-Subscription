import type { RouterOutputs } from "@/trpc/shared";

export type ProgramSpotlight = RouterOutputs["program"]["getProgramSpotlight"];
export type ProgramCard = RouterOutputs["program"]["getProgramCards"][0];

// VIDEOS
export type Chapter = RouterOutputs["video"]["getBySlug"];

// SHOTS
export type ShotCard = RouterOutputs["shot"]["getShotCards"][0];
export type ShotCarousel =
  RouterOutputs["shot"]["getCarouselShots"]["shots"][0];
export type AdminShot = RouterOutputs["shot"]["_getById"];

// COMMENTS
export type ApiComment =
  RouterOutputs["comment"]["getBySourceId"]["comments"][0];
