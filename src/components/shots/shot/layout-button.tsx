import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { cn } from "@/lib/utils/cn";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

type LayoutButtonProps = {
  label: string;
  asChild?: boolean;
  children?: React.ReactNode;
};

export const LayoutButton = forwardRef<HTMLButtonElement, LayoutButtonProps>(
  ({ label, children, asChild = false, ...props }, ref) => {
    const { isMobile } = useDeviceType();

    const Comp = asChild ? Slot : "button";

    return (
      <div
        key={label}
        className="flex flex-col items-center justify-center gap-px"
      >
        <Comp
          ref={ref}
          className={cn(
            "h-12 w-12 pointer-events-auto flex items-center justify-center rounded-full  p-0  transition-colors",
            "bg-foreground/70 dark:bg-background/70",
          )}
          {...props}
        >
          {children}
        </Comp>
        <p
          className={cn(
            "text-xs font-medium  text-white ",
            "xl:delay-400",
            isMobile && "landscape:hidden",
          )}
        >
          {label}
        </p>
      </div>
    );
  },
);
