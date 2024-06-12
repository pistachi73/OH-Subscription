import { X } from "lucide-react";

import { ShotSideWrapper } from "./shot-side-wrapper";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DeviceOnly } from "../ui/device-only/device-only";

type ShotTranscriptProps = {
  showTranscript: boolean;
  setShowTranscript: (show: boolean) => void;
};

export const ShotTranscript = ({
  showTranscript,
  setShowTranscript,
}: ShotTranscriptProps) => {
  return (
    <ShotSideWrapper
      isDialogOpen={showTranscript}
      onDialogOpenChange={(open) => {
        setShowTranscript(open);
      }}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md",
          "xl:border xl:bg-accent/40",
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between p-3 pt-0",
            "sm:p-4",
          )}
        >
          <h2 className={cn("text-base font-medium sm:text-lg", "lg:text-xl")}>
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
        <div className="p-3 pt-0">
          <p className="text-sm sm:text-base ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed
          </p>
        </div>
      </div>
    </ShotSideWrapper>
  );
};
