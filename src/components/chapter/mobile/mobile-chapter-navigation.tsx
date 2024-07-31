import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { cn } from "@/lib/utils";
import { useChapterContext } from "../chapter-context";

export const MobileChapterNavigation = () => {
  const { mobileButtons } = useChapterContext();

  return (
    <MaxWidthWrapper
      as="nav"
      className={cn(
        "py-2 relative z-20 w-full h-12 bg-muted-background border-y border-input flex items-center shadow-sm transition-transform duration-300 ease-in-out",
        "sm:relative sm:top-0 sm:left-0",
      )}
    >
      <ul className="flex flex-row gap-3 items-center flex-no-wrap overflow-x-scroll no-scrollbar">
        {mobileButtons.map(({ label, isActive, hidden, ...rest }) => {
          return hidden ? null : (
            <li key={label}>
              <button
                key={label}
                className={cn(
                  "px-3 text-sm h-8 w-fit text-muted-foreground font-normal transition-colors rounded-md",
                  isActive
                    ? "text-background font-medium bg-foreground"
                    : "text-foreground bg-accent",
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
