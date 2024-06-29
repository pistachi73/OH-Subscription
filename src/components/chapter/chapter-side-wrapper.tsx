import { AnimatePresence, motion } from "framer-motion";
import type { PropsWithChildren } from "react";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import { regularEase } from "@/lib/animation";
import { cn } from "@/lib/utils";

type ChapterSideWrapperProps = PropsWithChildren & {
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
};

export const ChapterSideWrapper = ({
  children,
  isDialogOpen,
  onDialogOpenChange,
}: ChapterSideWrapperProps) => {
  const { deviceSize, deviceType } = useDeviceType();

  return deviceSize.includes("lg") ? (
    <AnimatePresence mode="wait">
      {isDialogOpen && (
        <motion.div
          initial={{ opacity: 0, x: "-75%" }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: regularEase, delay: 0.25 },
          }}
          exit={{ opacity: 0, x: "-75%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full w-[450px] absolute top-0 left-0 bg-muted-background"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  ) : (
    <ResponsiveDialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <ResponsiveDialogContent
        className={cn(
          "max-h-[95%] w-full p-0 bg-muted-background",
          deviceType === "mobile"
            ? "w-full rounded-md h-[75%]"
            : "w-[500px] pt-0 h-[80%]  rounded-md ",
        )}
        hideClose
      >
        {children}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
