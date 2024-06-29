"use client";
import { LogIn } from "lucide-react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { AuthButton } from "../auth/auth-button";
import { Button } from "../ui/button";
import { SearchInput } from "../ui/search-input";

import { mobileNavItems, useCanRenderHeader } from "./helpers";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { UserButton } from "../auth/user-button";
import ThemeSwitch from "../theme-switch";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";

export const MobileHeader = () => {
  const { scrollY } = useScroll();
  const [hiddenTopBar, setHiddenTopBar] = useState(false);
  const { visible } = useCanRenderHeader();

  const user = useCurrentUser();
  const segment = useSelectedLayoutSegment();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;

    if (latest === 0 && prev > 68) {
      //Opening of drawer or modal
      return;
    }

    if (latest > prev && latest > 68) setHiddenTopBar(true);
    else setHiddenTopBar(false);
  });

  if (!visible) return null;

  return (
    <nav className="relative">
      <div className="h-12 block w-full" />
      <MaxWidthWrapper
        className={cn(
          "fixed top-0 z-50 flex h-12 w-full items-center bg-muted-background border-b border-accent justify-between gap-4 transition-transform duration-300",
          hiddenTopBar ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <Link href="/">
          <Image
            src={"/images/oh-logo.png"}
            alt="logo"
            width={40}
            height={40}
          />
        </Link>
        <div className="flex items-center grow justify-end">
          <SearchInput openWidth="w-full" className="h-9 text-2xs" />

          <ThemeSwitch />
          {user ? (
            <div className="ml-2">
              <UserButton user={user} />
            </div>
          ) : (
            <AuthButton asChild mode="modal">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                name="join"
                className="text-sm h-8 w-8"
                aria-label="Login"
              >
                <LogIn size={16} />
              </Button>
            </AuthButton>
          )}
        </div>
      </MaxWidthWrapper>

      <motion.ol
        layout
        layoutRoot
        className="fixed bottom-0 z-50 flex w-dvw flex-row items-end border-t bg-background pb-1"
      >
        {mobileNavItems.map(
          ({ href, title, icon: Icon, iconOutline: IconOutline }) => {
            const isActive = segment ? href.includes(segment) : href === "/";
            return (
              <li
                key={title}
                className={cn(
                  "relative flex basis-1/5 items-center justify-center pt-2 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground ",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active-underline"
                    className="absolute top-0 w-full bg-foreground h-0.5 z-10"
                  />
                )}
                <Link
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-px",
                  )}
                >
                  {isActive ? (
                    <Icon className="fill-foreground h-5 w-5" />
                  ) : (
                    <IconOutline className="fill-muted-foreground h-5 w-5" />
                  )}
                  {/* <Icon size={24} strokeWidth={isActive ? 1.5 : 1} /> */}
                  <span className="text-2xs text-muted-foreground">
                    {title}
                  </span>
                </Link>
              </li>
            );
          },
        )}
      </motion.ol>
    </nav>
  );
};
