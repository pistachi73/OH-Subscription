import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import type React from "react";
import { forwardRef } from "react";

import { AuthButton } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import type { ProgramCard, ProgramSpotlight } from "@/server/db/schema.types";
import { PlayIcon } from "../ui/icons";

const buttonVariants = cva("py-2", {
  variants: {
    size: {
      card: "h-auto min-h-14 px-6",
      hero: "h-auto min-h-14 md:min-h-16 rounded-md px-6",
    },
  },
  defaultVariants: {
    size: "card",
  },
});

const iconVariants = cva("", {
  variants: {
    size: {
      card: "w-6 min-h-6",
      hero: "md:w-8 md:min-h-8 w-6 min-h-6",
    },
  },
});

const fontVariants = cva("font-medium tracking-tight", {
  variants: {
    size: {
      hero: "text-base md:text-xl",
      card: "text-base md:text-lg",
    },
  },
});

type ProgramPlayButtonProps = {
  program: NonNullable<ProgramCard | ProgramSpotlight>;
  navigationMode: "details" | "auth";
  className?: string;
} & VariantProps<typeof buttonVariants>;

export const ProgramMainCTAButton = forwardRef<
  HTMLButtonElement,
  ProgramPlayButtonProps
>(({ program, className, navigationMode = "details", size = "card" }, ref) => {
  const { lastWatchedChapter, firstChapter, slug } = program;
  const user = useCurrentUser();
  const isSubscribed = user?.isSubscribed;

  const programDetailsHref = `/programs/${slug}`;

  const chapterHref = lastWatchedChapter
    ? `${programDetailsHref}/chapters/${lastWatchedChapter.chapterSlug}?start=${Math.floor(lastWatchedChapter.watchedDuration)}`
    : firstChapter
      ? `${programDetailsHref}/chapters/${firstChapter.chapterSlug}`
      : programDetailsHref;

  const AuthButtonContent = (
    <span className="font-medium text-center md:text-left">
      <span className="block"> Watch with OH Premium</span>
      <span className="block text-sm md:text-base">
        Start your 30-day free trial
      </span>
    </span>
  );

  const DetailsButtonContent = <span>More details</span>;

  return isSubscribed ? (
    <ButtonWrapper
      ref={ref}
      asChild
      className={cn(
        size === "hero" && "pl-4 pr-6",
        size === "card" && "pl-2 pr-4",
        className,
      )}
      size={size}
    >
      <Link
        href={chapterHref}
        className={cn(fontVariants({ size }), "flex items-center gap-3")}
      >
        <PlayIcon className={cn(iconVariants({ size }), "ml-0.5")} />
        <span>
          {program.lastWatchedChapter
            ? `Resume E${program.lastWatchedChapter.chapterNumber}`
            : "Start watching"}
        </span>
      </Link>
    </ButtonWrapper>
  ) : user || (!user && navigationMode === "details") ? (
    <ButtonWrapper ref={ref} asChild className={className} size={size}>
      <Link
        href={navigationMode === "details" ? programDetailsHref : "/plans"}
        className={cn(fontVariants({ size }))}
      >
        {navigationMode === "details"
          ? DetailsButtonContent
          : AuthButtonContent}
      </Link>
    </ButtonWrapper>
  ) : (
    <AuthButton mode="modal" asChild redirectToIfNotSubscribed="/plans">
      <Button
        ref={ref}
        variant="default"
        className={cn(
          buttonVariants({ size }),
          fontVariants({ size }),
          className,
        )}
      >
        {AuthButtonContent}
      </Button>
    </AuthButton>
  );
});

export const ButtonWrapper = forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
  } & VariantProps<typeof buttonVariants>
>(({ children, className, size, asChild = false }, ref) => {
  return (
    <Button
      ref={ref}
      variant="default"
      className={cn(buttonVariants({ size }), className)}
      asChild={asChild}
    >
      {children}
    </Button>
  );
});
