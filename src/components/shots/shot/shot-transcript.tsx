import { X } from "lucide-react";

import { ShotSideWrapper } from "./shot-side-wrapper";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { DeviceOnly } from "../../ui/device-only/device-only";
import { useDeviceType } from "../../ui/device-only/device-only-provider";
import { useShotContext } from "./shot-context";

type ShotTranscriptProps = {
  transcript?: string | null;
};

export const ShotTranscript = ({ transcript }: ShotTranscriptProps) => {
  const { showTranscript, setShowTranscript } = useShotContext();
  const { isMobile } = useDeviceType();
  return (
    <ShotSideWrapper
      isDialogOpen={showTranscript}
      onDialogOpenChange={(open) => {
        setShowTranscript(open);
      }}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-r-xl",
          "xl:border xl:bg-background xl:border-l-0",
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between px-4 py-3",
            isMobile && "pt-0",
          )}
        >
          <h2 className={cn("text-base md:text-lg font-medium ")}>
            Transcript
          </h2>

          <DeviceOnly allowedDevices={["tablet", "desktop"]}>
            <Button
              variant="ghost"
              size="inline"
              className="hidden p-1 sm:block"
              onClick={() => setShowTranscript(false)}
            >
              <X size={20} />
            </Button>
          </DeviceOnly>
        </div>
        {transcript && (
          <div className="px-4 py-3 pt-0">
            <p className="text-sm sm:text-base ">{transcript}</p>
          </div>
        )}
      </div>
    </ShotSideWrapper>
  );
};
