"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AuthButton } from "../auth/auth-button";
import { UserButton } from "../auth/user-button";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";

import { headerNavItems } from "./helpers";

import { Button, type ButtonProps } from "@/components/ui/button";
import { DeviceOnly } from "@/components/ui/device-only/device-only";
import { SearchInput } from "@/components/ui/search-input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

export const DesktopHeader = () => {
  const user = useCurrentUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { deviceType } = useDeviceType();
  const [isScrolled, setIsScrolled] = useState(false);

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
        "sticky top-0 z-50 bg-background sm:h-header sm:bg-transparent",
      )}
    >
      <MaxWidthWrapper
        className={clsx(
          "relative flex h-full items-center justify-center gap-4 transition-colors duration-200",
          {
            "bg-background": !isScrolled,
            "bg-transparent": isScrolled,
          },
        )}
      >
        <nav
          className={cn(
            "relative flex h-full flex-row items-center gap-14 rounded-sm  bg-background px-4 py-1 transition-transform duration-300 ease-out",
            {
              "rounded-b-none": isSearchOpen,
              "shadow-sm sm:translate-y-3": isScrolled,
            },
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

          <ul className="flex h-full items-center gap-1">
            {headerNavItems.map((item) => (
              <li key={item.title}>
                <NavButton>
                  <Link href={item.href}>{item.title}</Link>
                </NavButton>
              </li>
            ))}
          </ul>
          <AnimatePresence mode="wait">
            {isSearchOpen && (
              <motion.div
                className="absolute left-0 top-full w-full overflow-hidden rounded-b-sm bg-accent shadow-sm"
                initial={{ opacity: 1, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 1, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="p-3">
                  <SearchInput
                    autoFocus
                    onBlur={() => {
                      setIsSearchOpen(false);
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex h-full flex-row items-center gap-1">
            <NavButton
              onClick={() => {
                isSearchOpen && setIsSearchOpen(false);
                setIsSearchOpen(!isSearchOpen);
              }}
              justIcon
              name="search"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </NavButton>

            {user ? (
              <UserButton user={user} />
            ) : (
              <>
                <AuthButton asChild mode="modal" formType="login">
                  <NavButton justIcon={deviceType === "tablet"}>
                    {deviceType === "tablet" ? <LogIn /> : "Join"}
                  </NavButton>
                </AuthButton>
                <DeviceOnly allowedDevices={"desktop"}>
                  <AuthButton asChild mode="modal" formType="register">
                    <NavButton>Sign in</NavButton>
                  </AuthButton>
                </DeviceOnly>
              </>
            )}
          </div>
        </nav>
      </MaxWidthWrapper>
    </header>
  );
};

const NavButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { justIcon?: boolean }
>(({ children, className, justIcon, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "font-medium text-foreground hover:bg-primary hover:text-primary-foreground",
        { "h-9 w-9 px-2": justIcon, "px-3": !justIcon },
        className,
      )}
      variant="ghost"
      size="sm"
      {...rest}
    >
      {children}
    </Button>
  );
});
NavButton.displayName = "NavButton";
