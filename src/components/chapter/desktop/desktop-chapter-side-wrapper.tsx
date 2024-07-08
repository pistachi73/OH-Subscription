import { AnimatePresence, motion } from "framer-motion";
import type { PropsWithChildren } from "react";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { regularEase } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";
import { useChapterContext } from "../chapter-context";

type ChapterSideWrapperProps = PropsWithChildren & {
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  header: string;
};

export const ChapterSideWrapper = ({
  children,
  header,
  isDialogOpen,
  onDialogOpenChange,
}: ChapterSideWrapperProps) => {
  const { deviceSize, deviceType } = useDeviceType();
  const { setActiveTab } = useChapterContext();

  return deviceType === "desktop" ? (
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
          className="h-full w-[350px] xl:w-[450px] absolute top-0 left-0 bg-muted-background flex flex-col"
        >
          <div
            className={cn(
              "flex flex-row items-center justify-between p-4  pb-0",
            )}
          >
            <h2 className={cn("text-base font-medium md:text-lg")}>{header}</h2>
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="p-2 hidden md:block"
                onClick={() => setActiveTab(null)}
              >
                <X size={20} />
              </Button>
            </div>
          </div>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  ) : deviceType === "tablet" ? (
    <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[95%] w-full p-0 bg-muted-background",
          "w-[500px] pt-0 h-[80%]  rounded-md ",
        )}
        hideClose
      >
        {children}
      </DialogContent>
    </Dialog>
  ) : null;
};
