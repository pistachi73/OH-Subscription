import { Badge } from "@/components/ui/badge";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { cn } from "@/lib/utils";
import type { ShotProps } from ".";
import { useShotContext } from "../shot/shot-context";
import { LayoutButton } from "./layout-button";
import { LayoutButtonShare } from "./layout-button-share";

export const ShotLayout = ({ shot }: ShotProps) => {
  const { isMobile } = useDeviceType();
  const { shotOptionsButtons } = useShotContext();

  return (
    <div
      className={cn(
        "pointer-events-none py-2 absolute bottom-0 left-0 z-0 w-full transition-all duration-300 ease-in-out",
        "flex flex-row items-end ",
        "bg-gradient-to-t from-black/50 from-25% to-black/0",
        isMobile
          ? "pb-4 px-2 pr-1 gap-1"
          : "pb-5 px-4 pr-2 gap-2 group-hover:pb-12 rounded-2xl overflow-hidden",
      )}
    >
      <div className="flex flex-col gap-1 w-full">
        <h2
          className={cn(
            "font-semibold tracking-tight text-background dark:text-foreground",
            isMobile ? "text-sm" : "text-base",
          )}
        >
          {shot?.title}
        </h2>

        <p
          className={cn(
            "text-background dark:text-foreground line-clamp-3 text-sm",
            isMobile ? "text-xs" : "text-sm",
          )}
        >
          {shot?.description}
        </p>
        {shot.categories && (
          <div className="mt-1 flex flex-row gap-1 items-center overflow-hidden touch-pan-x">
            {shot.categories?.map(({ name, id }) => (
              <Badge
                className={cn(
                  "bg-[hsl(234.55,22.58%,20.08%)] dark:bg-accent text-white hover:bg-[hsl(234.55,22.58%,20.08%)]/80",
                )}
                variant={"accent"}
                key={`shot${shot.id}_category${id}`}
              >
                {name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className={cn("flex flex-col gap-4")}>
        {shotOptionsButtons.map(({ icon: Icon, label, ...props }) => {
          const isShare = label === "Share";
          if (label === "Transcript" && !shot.transcript) return null;
          if (isShare)
            return (
              <LayoutButtonShare
                key={label}
                shot={shot}
                label={label}
                icon={Icon}
              />
            );
          return (
            <LayoutButton key={label} label={label} icon={Icon} {...props} />
          );
        })}
      </div>
    </div>
  );
};
