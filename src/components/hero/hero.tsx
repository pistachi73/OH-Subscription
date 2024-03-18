import Image from "next/image";

import { MaxWidthWrapper } from "../max-width-wrapper";
import { HeroCarousel } from "../ui/carousel/hero-carousel";
import { DeviceOnly } from "../ui/device-only/device-only";

import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Hero = async () => {
  const user = await currentUser();

  const isLoggedIn = !Boolean(user);

  const Wrapper = isLoggedIn ? "div" : MaxWidthWrapper;

  return (
    <Wrapper
      className={cn(
        "relative  w-full -translate-y-[55px] text-center",
        "-mb-[56px] lg:-mb-[76px]",
        "aspect-video lg:aspect-[10/4]",
      )}
    >
      <div className="absolute -bottom-[30%] left-0 z-10 h-[25%] w-full bg-gradient-to-t from-white" />

      {isLoggedIn ? (
        <>
          <HeroCarousel />
        </>
      ) : (
        <>
          <div className="absolute left-0 top-0 h-[130%] w-full">
            <div
              className={` absolute left-0 top-0 z-10 h-full w-full  bg-gradient-to-r  from-white from-20% to-transparent to-50% `}
            />
            <div className="absolute -bottom-[30%] left-0 z-10 h-[25%] w-full bg-gradient-to-t from-white" />
            <Image
              src="/images/hero-background.png"
              alt="Hero background image"
              fill
              className="right-0-0 absolute top-0 -z-10 w-full bg-right object-cover"
              priority
            />
          </div>
          <div className="relative z-10 flex  h-full w-4/5 max-w-[600px] flex-col justify-center gap-2 md:w-3/5 md:gap-4">
            <h1 className="text-left text-2xl font-semibold leading-tight tracking-tighter md:text-4xl 2xl:text-6xl">
              The only subscription you{" "}
              <span>
                <i className="text-[#FF5C00]">really</i>
              </span>{" "}
              need to boost your English
            </h1>
            <div className="w-3/4 space-y-4 md:space-y-8">
              <p className="w-full text-left text-xs text-gray-800 md:text-sm 2xl:w-[400px] 2xl:text-base">
                Dive into tailored video lessons, interactive clubs, and
                personalized coaching sessions.
              </p>
              <div className="flex flex-row items-center gap-2">
                <DeviceOnly allowedDevices={["tablet", "desktop"]}>
                  <Button variant="default" size="lg" className="w-fit">
                    {/* <Play size={22} className="mr-2 fill-current" /> */}
                    Subscribe for 4.99€
                  </Button>
                  <Button variant="ghost" size="lg" className="w-fit">
                    {/* <Info size={22} className="mr-2" /> */}
                    Try for free
                  </Button>
                </DeviceOnly>
                <DeviceOnly allowedDevices={["mobile"]}>
                  <Button variant="default" size="sm" className="w-fit">
                    {/* <Play size={18} className="mr-2" /> */}
                    Subscribe for 4.99€
                  </Button>
                  <Button variant="ghost" size="sm" className="w-fit">
                    {/* <Info size={18} className="mr-2" /> */}
                    Try for free
                  </Button>
                </DeviceOnly>
              </div>
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
};
