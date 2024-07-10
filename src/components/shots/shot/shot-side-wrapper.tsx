import { AnimatePresence, m } from "framer-motion";
import type { PropsWithChildren } from "react";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import { cn } from "@/lib/utils";

type ShotSideWrapperProps = PropsWithChildren & {
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
};

export const ShotSideWrapper = ({
  children,
  isDialogOpen,
  onDialogOpenChange,
}: ShotSideWrapperProps) => {
  const { deviceSize, deviceType } = useDeviceType();

  return deviceSize.includes("xl") ? (
    <AnimatePresence mode="wait">
      {isDialogOpen && (
        <m.div
          initial={{ opacity: 0, x: "-90%" }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.3,
              ease: "easeInOut",
            },
          }}
          exit={{ opacity: 0, x: "-90%" }}
          className="absolute left-full aspect-[9/16] h-full w-full max-w-[500px] -z-10"
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  ) : (
    <ResponsiveDialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <ResponsiveDialogContent
        className={cn(
          "max-h-[95%] w-full p-0 pt-2",
          deviceType === "mobile"
            ? "w-full"
            : "w-[500px] pt-0 h-[80%] rounded-md",
        )}
        hideClose
      >
        {children}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
