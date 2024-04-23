import { type ReactNode, forwardRef } from "react";

import { cn } from "@/lib/utils";

export const MaxWidthWrapper = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: ReactNode;
  }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mx-auto w-full px-[4%] 2xl:px-14", className)}
    >
      {children}
    </div>
  );
});

MaxWidthWrapper.displayName = "MaxWidthWrapper";
