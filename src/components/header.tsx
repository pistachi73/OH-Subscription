"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { AuthButton } from "./auth/auth-button";
import { UserButton } from "./auth/user-button";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { Button } from "./ui/button";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

export const Header = () => {
  const user = useCurrentUser();
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50  bg-gradient-to-t transition-colors duration-200",
        {
          "bg-white": isScrolled,
        },
      )}
    >
      <MaxWidthWrapper className="bg relative flex items-center justify-between py-4">
        <nav className="flex items-center gap-12">
          <a href="/">
            <Image
              src={"/images/oh-logo.png"}
              alt="logo"
              width={40}
              height={40}
            />
          </a>
          <ul className="flex items-center gap-6">
            <li>
              <a href="/" className="text-sm text-gray-800 ">
                Learning capsules
              </a>
            </li>
            <li>
              <a href="/" className="text-sm text-gray-800">
                Coaching
              </a>
            </li>
            <li>
              <a href="/" className="text-sm text-gray-800">
                Our clubs
              </a>
            </li>
            <li>
              <a href="/" className="text-sm text-gray-800">
                Podcast
              </a>
            </li>
          </ul>
        </nav>
        {user ? (
          <UserButton user={user} />
        ) : (
          <div className="flex flex-row gap-2">
            <AuthButton asChild mode="modal" formType="login">
              <Button variant="secondary" size="sm">
                Log in
              </Button>
            </AuthButton>
            <AuthButton asChild mode="modal" formType="register">
              <Button variant="default" size="sm">
                Sign in
              </Button>
            </AuthButton>
          </div>
        )}
      </MaxWidthWrapper>
    </header>
  );
};
