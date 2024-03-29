import Image from "next/image";

import { DeviceOnly } from "../ui/device-only/device-only";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";

import { HeroCarousel } from "./hero-carousel";

import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Hero = async () => {
  const user = await currentUser();

  const isLoggedIn = !Boolean(user);

  return <HeroCarousel />;
};
