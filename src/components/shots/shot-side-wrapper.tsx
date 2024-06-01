import { AnimatePresence, cubicBezier, motion } from "framer-motion";
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
  const { deviceSize } = useDeviceType();

  return deviceSize.includes("xl") ? (
    <AnimatePresence mode="wait">
      {isDialogOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              delay: 0.4,
              ease: cubicBezier(0.4, 0, 0.2, 1),
            },
          }}
          exit={{ opacity: 0, x: 10 }}
          className="absolute left-[calc(100%+16px)] aspect-[9/16] h-full w-full max-w-[500px]"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  ) : (
    <ResponsiveDialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <ResponsiveDialogContent
        className={cn(
          "max-h-[95%] w-full p-0 pt-2",
          "sm:h-[80%] sm:w-[500px] sm:rounded-md sm:pt-0",
        )}
        hideClose
      >
        {children}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
