"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cross, LogIn, MenuIcon, Search, SearchCheck, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthButton } from "./auth/auth-button";
import { UserButton } from "./auth/user-button";
import { useDeviceType } from "./ui/device-only/device-only-provider";
import { Input } from "./ui/input";
import { MaxWidthWrapper } from "./ui/max-width-wrapper";

import { Button, type ButtonProps } from "@/components/ui/button";
import { DeviceOnly } from "@/components/ui/device-only/device-only";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { SearchInput } from "@/components/ui/search-input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Learning capsules",
    href: "/",
  },
  {
    title: "Coaching",
    href: "/",
  },
  {
    title: "Our clubs",
    href: "/",
  },
  {
    title: "Podcast",
    href: "/",
  },
];

export const Header = () => {
  const user = useCurrentUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { deviceType } = useDeviceType();

  return (
    <header
      className={cn(
        "sticky top-0 z-50   bg-slate-100 shadow-sm transition-colors duration-200 sm:h-header sm:translate-y-2 sm:bg-transparent sm:shadow-none",
      )}
    >
      <MaxWidthWrapper className="relative flex h-full items-center justify-center gap-4">
        <DeviceOnly allowedDevices={["mobile"]}>
          <div
            className={cn(
              "relative flex w-full flex-row items-center justify-between gap-10 rounded-sm bg-slate-100 sm:px-2 sm:py-1 sm:shadow-sm",
              {
                "rounded-b-none": isSearchOpen,
                "delay-200": !isSearchOpen,
              },
            )}
          >
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <NavButton justIcon>
                  <MenuIcon size={16} />
                </NavButton>
              </DrawerTrigger>
              <DrawerContent className="flex w-screen max-w-[320px] px-3 py-6">
                <ul className="flex w-full flex-col  gap-4">
                  <li className="w-full px-2">
                    <AuthButton asChild mode="modal" formType="login">
                      <Button variant="default" className="w-full">
                        Join
                      </Button>
                    </AuthButton>
                  </li>
                  <li>
                    <Link href="/" className="text-sm text-gray-800 ">
                      <Button
                        variant="ghost"
                        className="w-full items-start justify-start px-2 text-left"
                      >
                        Learning capsules
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-sm text-gray-800 ">
                      <Button
                        variant="ghost"
                        className="w-full items-start justify-start px-2 text-left"
                      >
                        Coaching
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-sm text-gray-800 ">
                      <Button
                        variant="ghost"
                        className="w-full items-start justify-start px-2 text-left"
                      >
                        Our clubs
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-sm text-gray-800 ">
                      <Button
                        variant="ghost"
                        className="w-full items-start justify-start px-2 text-left"
                      >
                        Podcast
                      </Button>
                    </Link>
                  </li>
                </ul>
              </DrawerContent>
            </Drawer>
            <Link href="/">
              <Image
                src={"/images/oh-logo.png"}
                alt="logo"
                width={40}
                height={40}
              />
            </Link>
            <div className="flex items-center gap-1">
              <NavButton
                justIcon
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                name="search"
              >
                {isSearchOpen ? <X size={16} /> : <Search size={16} />}
              </NavButton>
              {/* <AuthButton asChild mode="modal" formType="login">
                <NavButton>Join</NavButton>
              </AuthButton> */}
            </div>
            <AnimatePresence mode="wait">
              {isSearchOpen && (
                <motion.div
                  className="absolute -left-[3%] top-full w-screen overflow-y-clip overflow-x-visible rounded-b-sm bg-slate-200 shadow-sm sm:w-full"
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
          </div>
        </DeviceOnly>
        <DeviceOnly allowedDevices={["desktop", "tablet"]}>
          <div
            className={cn(
              "relative flex h-full flex-row items-center gap-10 rounded-sm bg-slate-100 px-4 py-1 shadow-sm",
              {
                "rounded-b-none": isSearchOpen,
                "delay-200": !isSearchOpen,
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

            <nav>
              <ul className="flex h-full items-center gap-1">
                {navItems.map((item) => (
                  <li key={item.title}>
                    <NavButton>
                      <Link href={item.href}>{item.title}</Link>
                    </NavButton>
                  </li>
                ))}
              </ul>
            </nav>
            <AnimatePresence mode="wait">
              {isSearchOpen && (
                <motion.div
                  className="absolute left-0 top-full w-full overflow-hidden rounded-b-sm bg-slate-200 shadow-sm"
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
          </div>
        </DeviceOnly>
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
        "font-normal text-primary-800 hover:bg-primary hover:text-primary-foreground",
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
