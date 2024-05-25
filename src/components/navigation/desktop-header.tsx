"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AuthButton } from "../auth/auth-button";
import { UserButton } from "../auth/user-button";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";

import { headerNavItems } from "./helpers";

import { Button, type ButtonProps } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { useSelectedLayoutSegment } from "next/navigation";

export const DesktopHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useCurrentUser();
  const segment = useSelectedLayoutSegment();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-12 lg:h-14 border-b",
        isScrolled
          ? "bg-muted-background border-accent [transition:background-color_500ms,border-color_400ms_100ms]"
          : "border-transparent [transition:background-color_500ms,border-color_300ms]",
      )}
    >
      <MaxWidthWrapper
        as="nav"
        className={cn(
          "w-full relative flex h-full items-center justify-between  gap-4 transition-colors duration-200",
        )}
      >
        <div className="flex flex-row gap-4 items-center">
          <Link href="/">
            <Image
              src={"/images/oh-logo.png"}
              alt="logo"
              width={40}
              height={40}
            />
          </Link>

          <ul className="flex h-full items-center">
            {headerNavItems.map((item) => (
              <li key={item.title}>
                <NavButton
                  isActive={
                    segment ? item.href.includes(segment) : item.href === "/"
                  }
                >
                  <Link href={item.href}>{item.title}</Link>
                </NavButton>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex h-full flex-row items-center ">
          <SearchInput placeholder="Title, description" />

          {user ? (
            <UserButton user={user} />
          ) : (
            <AuthButton asChild mode="modal" formType="login">
              <NavButton className="pr-0">Get started</NavButton>
            </AuthButton>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
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
        "text-xs lg:text-sm text-shadow-lg font-normal hover:no-underline",
        isActive
          ? "text-foreground font-medium"
          : "text-foreground/80 hover:text-foreground/60",
        justIcon ? "h-9 w-9 px-2" : "px-3",
        className,
      )}
      variant="link"
      size="sm"
      {...rest}
    >
      {children}
    </Button>
  );
});
NavButton.displayName = "NavButton";
