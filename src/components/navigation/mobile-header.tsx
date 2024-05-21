"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { regularEase } from "../../lib/animation";
import { AuthButton } from "../auth/auth-button";
import { Button } from "../ui/button";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import { SearchInput } from "../ui/search-input";

import { mobileNavItems } from "./helpers";

import { cn } from "@/lib/utils";

export const MobileHeader = () => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [position, setPosition] = useState(window?.scrollY ?? 0);
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
      <MaxWidthWrapper
        as="section"
        className={cn(
          "fixed top-0 z-50 flex h-header w-full items-center justify-between border-b transition-transform duration-300",
          visible ? "translate-y-0" : "-translate-y-full",
          // "bg-gradient-to-b from-background to-transparent",
          // "bg-gradient-to-b from-background to-transparent",
          "bg-background",
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
        <div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              name="search"
            >
              {isSearchOpen ? <X size={16} /> : <Search size={16} />}
            </Button>
            <AuthButton asChild mode="modal" formType="login">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                name="join"
                className="text-sm"
              >
                Join
              </Button>
            </AuthButton>
          </div>
          <AnimatePresence mode="wait">
            {isSearchOpen && (
              <motion.div
                className="absolute left-0 top-full w-full overflow-y-clip overflow-x-visible rounded-b-sm bg-accent shadow-sm"
                initial={{ opacity: 1, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 1, height: 0 }}
                transition={{ duration: 0.2, ease: regularEase }}
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
      </MaxWidthWrapper>
      <MaxWidthWrapper
        as="ol"
        className="fixed bottom-0 z-50 flex w-dvw flex-row items-end border-t bg-background pb-1"
      >
        {mobileNavItems.map(({ href, title, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li
              key={href}
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
