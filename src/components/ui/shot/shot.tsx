"use client";
import { type Transition, cubicBezier, motion } from "framer-motion";
import { Heart, MessageSquareText, NotebookText, Share } from "lucide-react";
import { User } from "lucide-react";
import { useState } from "react";

import Image from "next/image";

import { ShotCommunity } from "./shot-community";
import { ShotTranscript } from "./shot-transcript";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { ShareButton } from "@/components/ui/share-button/share-button";
import { cn } from "@/lib/utils";

export const Shot = () => {
  const [showComments, setShowComments] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const { deviceSize } = useDeviceType();

  const shotOptionsButtons = [
    {
      icon: NotebookText,
      label: "Transcript",
      onClick: () => {
        setShowComments(false);
        setShowTranscript((prev) => !prev);
      },
    },
    { icon: Heart, label: "Like" },
    {
      icon: MessageSquareText,
      label: "Comment",
      onClick: () => {
        setShowTranscript(false);
        setShowComments((prev) => !prev);
      },
    },
    { icon: Share, label: "Share" },
  ] as const;

  const isDesktop = deviceSize.includes("xl");
  const canAnimate = showComments || showTranscript;
  const transition: Transition = {
    duration: 0.2,
    delay: canAnimate ? 0 : 0.4,
    ease: cubicBezier(0.4, 0, 0.2, 1),
  };

  console.log({
    showComments,
  });

  return (
    <motion.div
      // Half of the width of the comments section
      animate={{
        x: isDesktop && canAnimate ? "max(-250px, -50%)" : 0,
      }}
      transition={transition}
      className={cn(
        "relative flex h-full translate-x-0 items-end sm:aspect-[9/16]",
        "before:absolute  before:bottom-0 before:-z-10 before:h-[150px] before:w-full before:bg-gradient-to-t before:from-foreground before:content-[''] sm:before:rounded-b-md",
        "sm:rounded-md",
      )}
    >
      <div
        className={cn(
          "flex w-full items-end gap-2 p-3 pr-1",
          "sm:flex-row sm:p-6 sm:pr-3",
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
            <p className="text-sm sm:text-base">Jhon Doe</p>
          </div>
          <span className="line-clamp-3 text-sm">
            Vocabulary is the cornerstone of effective communication. the
            Vocabulary is the cornerstone of effective communication. the
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
                  color: "var(--text-color-foreground)",
                },
                animate: {
                  x: canAnimate ? 0 : "calc(100% + 28px)",
                  y: canAnimate ? 0 : 24,
                  color: canAnimate
                    ? "var(--text-color-background)"
                    : "var(--text-color-foreground)",
                },
              }
            : {
                initial: {
                  x: 0,
                  y: 0,
                  color: "var(--text-color-background)",
                },
              })}
          transition={transition}
          className={cn(
            "flex flex-col gap-3 text-background",
            "[--text-color-background:#fff] [--text-color-foreground:#9597a0]",
            "dark:[--text-color-background:#050610] dark:[--text-color-foreground:#8f92a8]",
          )}
        >
          {shotOptionsButtons.map(({ icon: Icon, label, ...props }) => {
            const isShare = label === "Share";

            return (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-1"
              >
                {isShare ? (
                  <ShareButton
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
                    {...props}
                  >
                    <Button
                      variant={"secondary"}
                      className={cn("h-12 w-12 rounded-full bg-accent/70 p-0")}
                    >
                      <Icon size={isDesktop ? 18 : 16} />
                    </Button>
                  </ShareButton>
                ) : (
                  <Button
                    variant={"secondary"}
                    className={cn("h-12 w-12 rounded-full bg-accent/70 p-0")}
                    {...props}
                  >
                    <Icon size={isDesktop ? 18 : 16} />
                  </Button>
                )}
                <p className="text-sm">{label}</p>
              </div>
            );
          })}
        </motion.div>
      </div>

      <div
        className={cn(
          "absolute left-0 top-0 -z-20 aspect-[9/16] h-full w-full overflow-hidden",
          "sm:rounded-md",
        )}
      >
        <Image
          src={"/images/hero-thumbnail-2.jpg"}
          alt="video"
          fill
          className="aspect-[9/16] object-cover"
        />
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
