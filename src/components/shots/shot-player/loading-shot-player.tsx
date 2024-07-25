import { SpinnerIcon } from "@/components/ui/icons";

export const LoadingShotPlayer = () => {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <SpinnerIcon className="h-8 w-8 md:h-12 md:w-12  animate-spin fill-white" />
    </div>
  );
};
