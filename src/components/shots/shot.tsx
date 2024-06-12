"use client";
import { cubicBezier, motion, type Transition } from "framer-motion";
import {
  FileVolume,
  Heart,
  MessageCircle,
  Share2Icon,
  User,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { ShotCommunity } from "./shot-community";
import { ShotTranscript } from "./shot-transcript";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { ShareButton } from "@/components/ui/share-button/share-button";
import { cn } from "@/lib/utils";
import "media-chrome";
import { ShotPlayer } from "./shot-player";

export const Shot = () => {
  const [showComments, setShowComments] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const { deviceSize } = useDeviceType();

  const shotOptionsButtons = [
    {
      icon: FileVolume,
      label: "Transcript",
      onClick: () => {
        setShowComments(false);
        setShowTranscript((prev) => !prev);
      },
    },
    { icon: Heart, label: "Like" },

    {
      icon: MessageCircle,
      label: "Comment",
      onClick: () => {
        setShowTranscript(false);
        setShowComments((prev) => !prev);
      },
    },
    {
      icon: Share2Icon,
      label: "Share",
    },
  ] as const;

  const isDesktop = deviceSize.includes("xl");
  const canAnimate = showComments || showTranscript;
  const transition: Transition = {
    duration: 0.2,
    delay: canAnimate ? 0 : 0.4,
    ease: cubicBezier(0.4, 0, 0.2, 1),
  };

  return (
    <motion.div
      // Half of the width of the comments section
      animate={{
        x: isDesktop && canAnimate ? "max(-250px, -50%)" : 0,
      }}
      transition={transition}
      className={cn(
        "relative flex w-full sm:w-auto h-full translate-x-0 items-end sm:aspect-[9/16] bg-background",
        "sm:rounded-md",
      )}
    >
      <div
        className={cn(
          "pointer-events-none relative z-10 flex w-full items-end justify-between gap-2 p-4 pr-1",
          "sm:flex-row sm:p-3 sm:pb-4 sm:pr-2",
        )}
      >
        <div className="space-y-2 text-background">
          <div className="flex flex-row items-center gap-3 ">
            <Avatar className="h-8 w-8">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-muted">
                <User className="text-muted-foreground" size={16} />
              </AvatarFallback>
            </Avatar>
            <p className="text-sm sm:text-base text-background dark:text-foreground">
              Jhon Doe
            </p>
          </div>
          <span className="line-clamp-3 text-sm text-background dark:text-foreground">
            Vocabulary is the cornerstone of effective communication.
          </span>
        </div>
        <motion.div
          // y: 24 is the bottom padding
          // x: 24 is the right padding + 8px for spacing
          {...(isDesktop
            ? {
                initial: {
                  x: "calc(100% + 28px)",
                  y: 24,
                },
                animate: {
                  x: canAnimate ? 0 : "calc(100% + 28px)",
                  y: canAnimate ? 0 : 24,
                },
              }
            : {
                initial: {
                  x: 0,
                  y: 0,
                },
              })}
          transition={transition}
          className={cn("flex flex-col gap-4")}
        >
          {shotOptionsButtons.map(({ icon: Icon, label, ...props }) => {
            const isShare = label === "Share";

            return isShare ? (
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
                <OptionButtonContent
                  icon={Icon}
                  label={label}
                  canAnimate={canAnimate}
                />
              </ShareButton>
            ) : (
              <OptionButtonContent
                key={label}
                icon={Icon}
                label={label}
                canAnimate={canAnimate}
                {...props}
              />
            );
          })}
        </motion.div>
      </div>

      <div className="absolute left-0 top-0 z-0 aspect-[9/16] w-full overflow-hidden sm:rounded-md h-full">
        <ShotPlayer playbackId="pDetWhEkgm9vA01US5fPhPlGec3JbDaCi029MuOZLj64w" />
      </div>

      <ShotCommunity
        showComments={showComments}
        setShowComments={setShowComments}
      />

      <ShotTranscript
        showTranscript={showTranscript}
        setShowTranscript={setShowTranscript}
      />
    </motion.div>
  );
};

const OptionButtonContent = ({
  icon: Icon,
  label,
  canAnimate,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  canAnimate: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-px">
      <button
        type="button"
        className={cn(
          "h-12 w-12 pointer-events-auto flex items-center justify-center rounded-full  p-0  transition-colors",
          "bg-foreground/70 dark:bg-background/70  text-white",
          "xl:bg-accent/70 xl:text-accent-foreground dark:bg-accent/70 dark:xl:text-accent-foreground  xl:hover:bg-accent/80",
          "xl:delay-400",
          canAnimate &&
            "xl:delay-0  xl:hover:delay-0 xl:bg-foreground/70 xl:dark:bg-background/70 xl:text-white xl:hover:bg-foreground/80 xl:dark:hover:bg-background/80",
        )}
        onClick={onClick}
      >
        <Icon className="w-5 h-5" />
      </button>
      <p
        className={cn(
          "text-sm font-medium  text-[hsl(210,40%,98%)] xl:text-accent-foreground",
          "xl:delay-400",
          canAnimate
            ? "font-medium xl:text-[hsl(210,40%,98%)] xl:delay-0"
            : "font-normal",
        )}
      >
        {label}
      </p>
    </div>
  );
};
