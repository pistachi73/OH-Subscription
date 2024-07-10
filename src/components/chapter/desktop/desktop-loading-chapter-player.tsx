import { SpinnerIcon } from "@/components/ui/icons";

export const DesktopLoadingChapterPlayer = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-black ease-in-out duration-300 overflow-hidden">
      <SpinnerIcon className="h-14 w-14 animate-spin fill-white" />
    </div>
  );
};
