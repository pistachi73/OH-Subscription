"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { createContext } from "react";
import { useDeviceType } from "./device-only/device-only-provider";

type TooltipTriggerContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TooltipTriggerContext = createContext<TooltipTriggerContextType>({
  open: false,
  setOpen: () => {}, // eslint-disable-line
});

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip: React.FC<TooltipPrimitive.TooltipProps> = ({
  children,
  ...props
}) => {
  const [open, setOpen] = React.useState<boolean>(props.defaultOpen ?? false);

  // we only want to enable the "click to open" functionality on mobile
  const { isMobile } = useDeviceType();

  return (
    <TooltipPrimitive.Root
      delayDuration={!isMobile ? props.delayDuration : 0}
      onOpenChange={(e) => {
        setOpen(e);
      }}
      open={open}
    >
      <TooltipTriggerContext.Provider value={{ open, setOpen }}>
        {children}
      </TooltipTriggerContext.Provider>
    </TooltipPrimitive.Root>
  );
};

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ children, ...props }, ref) => {
  const { isMobile } = useDeviceType();
  const { setOpen } = React.useContext(TooltipTriggerContext);

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      {...props}
      onClick={(e) => {
        if (isMobile) {
          e.preventDefault();
          setOpen(true);
        }
      }}
    >
      {children}
    </TooltipPrimitive.Trigger>
  );
});

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
