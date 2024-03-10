import { MaxWidthWrapper } from "../max-width-wrapper";

import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <MaxWidthWrapper className="flex w-full max-w-2xl flex-col items-start py-12 text-center">
      <div className="flex flex-col items-center space-y-6">
        <h1 className=" max-w-[500px] text-5xl font-semibold leading-tight tracking-tighter">
          The only subscription you{" "}
          <span>
            <i className="text-[#FF5C00]">really</i>
          </span>{" "}
          need to boost your English.
        </h1>
        <p className="text- max-w-[400px]">
          Dive into tailored video lessons, interactive clubs, and personalized
          coaching sessions.
        </p>
        <div className="flex flex-row items-center justify-center gap-2">
          <Button variant="outline" size="lg" className="w-fit">
            Try for free
          </Button>
          <Button variant="default" size="lg" className="w-fit">
            Subscribe for 4,99€
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
