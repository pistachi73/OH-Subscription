import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { useMobileHeaderHide } from "@/hooks/use-mobile-header-hide";
import { cn } from "@/lib/utils";
import { useChapterContext } from "../chapter-context";

export const MobileChapterNavigation = () => {
  const { mobileButtons } = useChapterContext();

  const { isHidden } = useMobileHeaderHide();

  return (
    <MaxWidthWrapper
      as="nav"
      className={cn(
        "relative z-20 w-full h-8 bg-muted-background border-b border-input flex items-center shadow-sm transition-transform duration-300 ease-in-out",
        isHidden ? "-translate-y-12" : "translate-y-0",
        "sticky top-[calc(var(--aspect-ratio-height)+48px)] left-0 sm:relative sm:top-0 sm:left-0",
        "sm:translate-y-0",
      )}
    >
      <ul className="flex flex-row gap-4 items-center flex-no-wrap overflow-x-scroll no-scrollbar">
        {mobileButtons.map(({ label, isActive, hidden, ...rest }) => {
          return hidden ? null : (
            <li key={label}>
              <button
                key={label}
                className={cn(
                  "h-8 text-sm w-fit text-muted-foreground font-normal transition-colors",
                  isActive && "text-secondary font-medium",
                )}
                type="button"
                {...rest}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </MaxWidthWrapper>
  );
};
