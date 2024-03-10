import Image from "next/image";

import { MaxWidthWrapper } from "../max-width-wrapper";

import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    // <div className="relative">
    //   <div className="absolute h-full w-full bg-red-200" />
    //   <MaxWidthWrapper className="relative flex w-full flex-col items-start py-12 text-center">
    //     <div className="flex flex-col items-center space-y-6">
    //       <h1 className=" max-w-[500px] text-5xl font-semibold leading-tight tracking-tighter">
    //         The only subscription you{" "}
    //         <span>
    //           <i className="text-[#FF5C00]">really</i>
    //         </span>{" "}
    //         need to boost your English.
    //        </h1>
    //       <p className="text- max-w-[400px]">
    //         Dive into tailored video lessons, interactive clubs, and
    //         personalized coaching sessions.
    //       </p>
    //       <div className="flex flex-row items-center justify-center gap-2">
    //         <Button variant="outline" size="lg" className="w-fit">
    //           Try for free
    //         </Button>
    //         <Button variant="default" size="lg" className="w-fit">
    //           Subscribe for 4,99€
    //         </Button>
    //       </div>
    //     </div>
    //   </MaxWidthWrapper>
    // </div>
    <MaxWidthWrapper className="relative -mb-[200px]  w-full -translate-y-[80px] text-center ">
      <Image
        src="/images/hero.png"
        alt="hero-background"
        fill
        className="absolute left-0 top-0 -z-10 w-full object-cover"
        priority
      />

      <div className="absolute left-0 top-0 -z-10 h-full w-full bg-gradient-to-r from-white to-[75%] 2xl:to-[50%]" />
      <div className="absolute bottom-0 left-0 -z-10 h-1/6 w-full bg-gradient-to-t from-white " />
      <div className="flex h-full w-3/5  max-w-[600px] -translate-y-[200px] flex-col justify-end gap-4 pt-[360px] md:w-2/5">
        <h1 className="text-left text-3xl font-semibold leading-tight tracking-tighter md:text-4xl 2xl:text-6xl ">
          The only subscription you{" "}
          <span>
            <i className="text-[#FF5C00]">really</i>
          </span>{" "}
          need to boost your English.
        </h1>
        <div className="w-3/4 space-y-4">
          <p className="w-full text-left text-xs text-primary-800 md:text-sm 2xl:w-[400px] 2xl:text-base">
            Dive into tailored video lessons, interactive clubs, and
            personalized coaching sessions.
          </p>
          <div className="flex flex-row items-center gap-2">
            <Button variant="outline" size="sm" className="w-fit">
              Try for free
            </Button>
            <Button variant="default" size="sm" className="w-fit">
              Subscribe for 4,99€
            </Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
