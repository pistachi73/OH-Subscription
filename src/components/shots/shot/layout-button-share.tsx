import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import type { Icon } from "@/components/ui/icons/icons.type";
import { ShareButton } from "@/components/ui/share-button/share-button";
import { cn } from "@/lib/utils";
import type { ShotCarouselData } from "@/server/db/schema.types";

type LayoutButtonShareProps = {
  shot: NonNullable<ShotCarouselData>;
  label: string;
  icon: Icon;
};

export const LayoutButtonShare = ({
  shot,
  label,
  icon: Icon,
}: LayoutButtonShareProps) => {
  const { isMobile } = useDeviceType();
  return (
    <div className="flex flex-col items-center justify-center gap-px">
      <ShareButton
        key={label}
        title="Share"
        description="Share this shot with your friends"
        url={"example.com"}
        config={{
          twitter: { title: "title", hashtags: "hashtag" },
          facebook: true,
          linkedin: true,
          email: {
            body: "body",
            email: "email",
            subject: "subject",
          },
          link: true,
        }}
        asChild
      >
        <button
          type="button"
          className={cn(
            "h-12 w-12 pointer-events-auto flex items-center justify-center rounded-full  p-0  transition-colors",
            "bg-foreground/70 dark:bg-background/70",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5 transition-colors",
              "fill-background dark:fill-foreground",
            )}
          />
        </button>
      </ShareButton>
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
