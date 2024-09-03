"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AuthButton } from "../auth/auth-button";
import { UserButton } from "../auth/user-button";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";

import { headerNavItems, useCanRenderHeader } from "./helpers";

import { Button, type ButtonProps } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils/cn";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useSelectedLayoutSegment } from "next/navigation";
import ThemeSwitch from "../theme-switch";

type DesktopHeaderProps = {
  renderAsScrolled?: boolean;
};

export const DesktopHeader = ({
  renderAsScrolled = false,
}: DesktopHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useCurrentUser();
  const segment = useSelectedLayoutSegment();
  const { visible } = useCanRenderHeader();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 10) setIsScrolled(true);
    else setIsScrolled(false);
  });

  if (!visible) return null;

  return (
    <>
      <div className="block h-12 sm:h-16" />
      <header
        className={cn(
          "fixed w-full top-0 z-50 h-12 sm:h-16   transition-colors duration-300 ease-in-out",
          isScrolled || segment === "(auth)" || renderAsScrolled
            ? "bg-muted-background/80 backdrop-blur-lg shadow-sm"
            : "shadow-none",
        )}
      >
        <MaxWidthWrapper
          as="nav"
          className={cn(
            "w-full relative flex h-full items-center justify-between  gap-4 transition-colors duration-200",
          )}
        >
          <div className="flex flex-row gap-8 items-center">
            <Link href="/" className="shrink-0">
              <Image
                src={"/images/oh-logo.png"}
                alt="logo"
                width={40}
                height={40}
              />
            </Link>

            <ul className="flex h-full items-center gap-1">
              {headerNavItems.map((item) => (
                <li key={item.title}>
                  <NavButton
                    isActive={
                      segment ? item.href.includes(segment) : item.href === "/"
                    }
                    asChild
                  >
                    <Link href={item.href}>{item.title}</Link>
                  </NavButton>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex h-full flex-row items-center grow justify-end gap-1">
            <SearchInput
              placeholder="Title, description"
              openWidth="w-full"
              className="max-w-[320px]"
            />
            <ThemeSwitch />

            {user ? (
              <div className="ml-2 flex gap-1 items-center h-9">
                <UserButton user={user} />
              </div>
            ) : (
              <AuthButton asChild mode="modal">
                <NavButton className="-mr-4">Get started</NavButton>
              </AuthButton>
            )}
          </div>
        </MaxWidthWrapper>
      </header>
    </>
  );
};

const NavButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { justIcon?: boolean; isActive?: boolean }
>(({ children, className, justIcon, isActive = false, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "text-base hover:no-underline font-medium",
        isActive && "bg-accent",
        justIcon ? "h-9 w-9 px-2" : "h-[42px] px-4",
        className,
      )}
      variant="ghost"
      size="default"
      {...rest}
    >
      {children}
    </Button>
  );
});
NavButton.displayName = "NavButton";
