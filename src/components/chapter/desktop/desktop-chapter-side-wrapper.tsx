import { AnimatePresence, m } from "framer-motion";
import type { PropsWithChildren } from "react";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { springTransition } from "@/lib/animation";
import { cn } from "@/lib/utils/cn";
import { DialogTitle } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../../ui/dialog";
import { useChapterContext } from "../chapter-context";

type ChapterSideWrapperProps = PropsWithChildren & {
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  header: string | JSX.Element;
};

export const ChapterSideWrapper = ({
  children,
  header,
  isDialogOpen,
  onDialogOpenChange,
}: ChapterSideWrapperProps) => {
  const { deviceType } = useDeviceType();
  const { setActiveTab, activeTab } = useChapterContext();

  return deviceType === "desktop" ? (
    <AnimatePresence mode="wait">
      {isDialogOpen && (
        <m.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { ...springTransition, delay: 0.3 },
          }}
          exit={{ opacity: 1, x: "-100%" }}
          transition={springTransition}
          className="h-full w-[400px] xl:w-[450px] absolute top-0 left-0 bg-muted-background flex flex-col"
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
        </m.div>
      )}
    </AnimatePresence>
  ) : deviceType === "tablet" ? (
    <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[95%] w-full p-0 bg-muted-background",
          "w-[500px] pt-0 h-[80%]  rounded-md flex flex-col",
        )}
        hideClose
      >
        <DialogHeader className="p-4 pb-0 h-auto">
          <DialogTitle className="text-lg font-medium tracking-tight">
            {header}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  ) : null;
};
