import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("mx-auto w-full px-[4%] 2xl:px-14", className)}>
      {children}
    </div>
  );
};
