import { SpinnerIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

export const DesktopLoadingChapterPlayer = ({
  className,
}: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full h-full bg-black ease-in-out duration-300 overflow-hidden",
        className,
      )}
    >
      <SpinnerIcon className="h-14 w-14 animate-spin fill-white" />
    </div>
  );
};
