import { X } from "lucide-react";

import { ShotSideWrapper } from "./shot-side-wrapper";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
            "flex flex-row items-center justify-between p-4 pt-0",
            "sm:pt-4",
          )}
        >
          <h2 className={cn("text-lg font-medium", "lg:text-xl")}>
            Transcript
          </h2>

          <Button
            variant="ghost"
            size="inline"
            className="hidden p-1 sm:block"
            onClick={() => setShowTranscript(false)}
          >
            <X size={20} />
          </Button>
        </div>
        <div className="p-4 pt-0">
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
