import { type ReactNode, forwardRef } from "react";

import { cn } from "@/lib/utils/cn";

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
      className={cn("mx-auto w-full px-[4%] 2xl:px-14", className)}
    >
      {children}
    </Component>
  );
});

MaxWidthWrapper.displayName = "MaxWidthWrapper";
