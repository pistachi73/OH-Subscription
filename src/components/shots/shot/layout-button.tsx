import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import type { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export const LayoutButton = ({
  label,
  icon: Icon,
  ...props
}: { icon: Icon; label: string }) => {
  const { isMobile } = useDeviceType();
  return (
    <div
      key={label}
      className="flex flex-col items-center justify-center gap-px"
    >
      <button
        type="button"
        className={cn(
          "h-12 w-12 pointer-events-auto flex items-center justify-center rounded-full  p-0  transition-colors",
          "bg-foreground/70 dark:bg-background/70",
        )}
        {...props}
      >
        <Icon
          className={cn(
            "w-5 h-5 transition-colors",
            "fill-background dark:fill-foreground",
          )}
        />
      </button>
      <p
        className={cn(
          "text-xs font-medium  text-white ",
          "xl:delay-400",
          isMobile && "landscape:hidden",
        )}
      >
        {label}
      </p>
    </div>
  );
};
