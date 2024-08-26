"use client";

import Image from "next/image";
import Link from "next/link";

import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

import { Button } from "@/components/ui/button";
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterXIcon,
} from "@/components/ui/icons";
import { UserStatusLink } from "@/components/ui/user-status-link";

import type { ButtonProps } from "@/components/ui/button";
import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { type UserStatus, useUserStatus } from "@/hooks/use-user-status";
import { cn } from "@/lib/utils/cn";
import type { RouterOutputs } from "@/trpc/shared";
import { useCanRenderFooter } from "../helpers";

const ctaButtonTextMap: Record<
  Partial<UserStatus>,
  { label: string; variant: ButtonProps["variant"] }
> = {
  LOGGED_IN_SUBSCRIBED: { label: "Browse", variant: "default" },

  LOGGED_IN_UNSUBSCRIBED: {
    label: "Subscribe to the OH Subscription",
    variant: "secondary",
  },
  LOGGED_OUT: { label: "Get started", variant: "default" },
};

type FooterContentProps = {
  categories: RouterOutputs["category"]["getAll"];
};

export const FooterContent = ({ categories }: FooterContentProps) => {
  const { isMobile } = useDeviceType();
  const shouldRenderFooter = useCanRenderFooter();
  const userStatus = useUserStatus();

  if (!shouldRenderFooter) return null;

  return (
    <MaxWidthWrapper
      as="footer"
      className="mt-16 lg:mt-24 border-t  border-border"
    >
      <div className="py-10  flex flex-row items-start justify-between gap-x-16 gap-y-12 flex-wrap ">
        <div className="max-w-[500px] space-y-3">
          <Image
            src={"/images/oh-logo.png"}
            alt="logo"
            width={50}
            height={50}
          />
          <h2 className="font-semibold tracking-tight text-2xl text-balance">
            The only suscription you need.
          </h2>

          {userStatus !== "LOGGED_IN_SUBSCRIBED" && (
            <Button
              className="w-fit h-12 text-base"
              variant={ctaButtonTextMap[userStatus].variant}
              asChild
            >
              <UserStatusLink href="/">
                {ctaButtonTextMap[userStatus].label}
              </UserStatusLink>
            </Button>
          )}
        </div>
        <div className="flex gap-x-16 gap-y-12 flex-wrap">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Browse</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Programs
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shots
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Content</h3>
            <ul
              className="grid grid-rows-4 gap-y-3 gap-x-6"
              style={{
                gridAutoFlow: "column",
              }}
            >
              {categories.slice(0, 3).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/programs/c/${category.slug}`}
                    className="text-base text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/programs"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse all
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3 shrink-0">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "min-h-16 flex items-center justify-between flex-wrap gap-4 py-2",
          isMobile && "pb-20",
        )}
      >
        <div className="text-left text-muted-foreground">
          © {new Date().getFullYear()} Oxford House Netflix. All rights
          reserved.
        </div>
        <div className="flex gap-2 text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">
            <LinkedinIcon className="w-6 h-6" />
          </a>
          <a href="/" className="hover:text-foreground transition-colors">
            <TwitterXIcon className="w-6 h-6" />
          </a>
          <a href="/" className="hover:text-foreground transition-colors">
            <FacebookIcon className="w-6 h-6" />
          </a>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
