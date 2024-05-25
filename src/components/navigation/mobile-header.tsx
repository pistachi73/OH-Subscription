"use client";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthButton } from "../auth/auth-button";
import { Button } from "../ui/button";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import { SearchInput } from "../ui/search-input";

import { mobileNavItems } from "./helpers";

import { cn } from "@/lib/utils";

export const MobileHeader = () => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [position, setPosition] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const moving = window.scrollY;

      if (position < moving && moving > 48) setVisible(false);
      else setVisible(true);
      setPosition(moving);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <nav className="relative">
      <div className="h-12 block w-full" />
      <MaxWidthWrapper
        as="section"
        className={cn(
          "fixed top-0 z-50 flex h-12 w-full items-center bg-muted-background border-b border-accent justify-between gap-4 transition-all duration-300",
          visible ? "translate-y-0" : "-translate-y-full",
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
          <AuthButton asChild mode="modal" formType="login">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              name="join"
              className="text-sm h-8 w-8"
            >
              <LogIn size={16} />
            </Button>
          </AuthButton>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper
        as="ol"
        className="fixed bottom-0 z-50 flex w-dvw flex-row items-end border-t bg-background pb-1"
      >
        {mobileNavItems.map(({ href, title, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li
              key={title}
              className={cn(
                "relative flex basis-1/5 items-center justify-center pt-2 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-px",
                )}
              >
                <Icon size={24} strokeWidth={1} />
                <span className="text-2xs">{title}</span>
              </Link>
            </li>
          );
        })}
      </MaxWidthWrapper>
    </nav>
  );
};
