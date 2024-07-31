import { Button } from "@/components/ui/button";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useChapterContext } from "../chapter-context";

type MobileChapterContentDrawerProps = {
  children: React.ReactNode;
  open: boolean;
  header: string;
  className?: string;
};

export const MobileChaterContentDrawer = ({
  open,
  children,
  header,
  className,
}: MobileChapterContentDrawerProps) => {
  const { deviceSize } = useDeviceType();
  const { setActiveTab } = useChapterContext();

  const isLandscape = deviceSize.includes("sm");

  return isLandscape ? (
    open ? (
      <div
        className={cn(
          "z-20 w-full  absolute left-0 bg-muted-background ",
          "top-[calc(var(--aspect-ratio-height))]",
        )}
      >
        <div className="text-left flex items-center justify-between border-y border-input px-4 py-2">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            {header}
          </h2>
          <Button
            variant={"ghost"}
            className="h-8 w-8 text-sm text-foreground p-0"
            onClick={() => {
              setActiveTab("details");
            }}
          >
            <span className="sr-only">Close {header} List Drawer</span>
            <X className="w-5 h-5" />
          </Button>
        </div>
        {children}
      </div>
    ) : null
  ) : (
    <Drawer
      open={open}
      fixed={true}
      onClose={() => {
        setActiveTab("details");
      }}
    >
      <DrawerContent
        overlayClassName="!pointer-events-none bg-transparent"
        className={cn(
          "max-h-full w-full bg-muted-background pointer-events-auto transition-[height] duration-300 ease-in-out",
          "h-[calc(100dvh-var(--aspect-ratio-height))]",
          className,
        )}
      >
        <DrawerHeader className="text-left flex items-center justify-between border-b border-input px-4 py-2">
          <DrawerTitle>{header}</DrawerTitle>
          <Button
            variant={"ghost"}
            className="h-8 w-8 text-sm text-foreground p-0"
            onClick={() => {
              setActiveTab("details");
            }}
          >
            <span className="sr-only">Close {header} List Drawer</span>
            <X className="w-5 h-5" />
          </Button>
        </DrawerHeader>

        {children}
      </DrawerContent>
    </Drawer>
  );
};
