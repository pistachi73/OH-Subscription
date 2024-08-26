import { Badge } from "@/components/ui/badge";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { HeartIcon, ShareIcon } from "@/components/ui/icons";
import { LikeButton } from "@/components/ui/like-button";
import { ShareButton } from "@/components/ui/share-button/share-button";
import { useLikeSource } from "@/hooks/use-like-source";
import { cn } from "@/lib/utils/cn";
import { getUrl } from "@/lib/utils/get-url";
import type { ShotProps } from ".";
import { useShotContext } from "../shot/shot-context";
import { LayoutButton } from "./layout-button";

export const ShotLayout = ({ shot }: ShotProps) => {
  const { isMobile } = useDeviceType();
  const { shotOptionsButtons } = useShotContext();

  const { like, isLikeLoading, isLikedByUser } = useLikeSource({
    initialLiked: shot.isLikedByUser,
  });

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
          if (label === "Transcript" && !shot.transcript) return null;
          return (
            <LayoutButton key={label} label={label} {...props}>
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  "fill-background dark:fill-foreground",
                )}
              />
            </LayoutButton>
          );
        })}
        <LayoutButton label="Like" asChild>
          <LikeButton
            isLikedByUser={isLikedByUser ?? false}
            isLikeLoading={isLikeLoading}
            like={() => like({ shotId: shot.id })}
          >
            <HeartIcon
              className={cn("w-5 h-5", isLikedByUser && "text-red-500")}
            />
          </LikeButton>
        </LayoutButton>
        <LayoutButton label="Share" asChild>
          <ShareButton
            title="Share"
            description="Share this shot with your friends"
            url={getUrl(`/shots/${shot.id}`)}
            config={{
              twitter: { title: "title", hashtags: "hashtag" },
              facebook: true,
              linkedin: true,
              email: {
                subject: `Check this shot out: ${shot.title}`,
                body: shot.description,
              },
              link: true,
            }}
          >
            <ShareIcon
              className={cn(
                "w-5 h-5 transition-colors",
                "fill-background dark:fill-foreground",
              )}
            />
          </ShareButton>
        </LayoutButton>
      </div>
    </div>
  );
};
