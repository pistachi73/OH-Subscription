import { type ReactNode, forwardRef } from "react";

import { cn } from "@/lib/utils";

export const MaxWidthWrapper = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    as?: string;
  }
>(({ className, children, as = "div" }, ref) => {
  const Component = as as any;
  return (
    <Component
      ref={ref}
      className={cn("mx-auto w-full px-[2%] sm:px-[4%] 2xl:px-14", className)}
    >
      {children}
    </Component>
  );
});

MaxWidthWrapper.displayName = "MaxWidthWrapper";
