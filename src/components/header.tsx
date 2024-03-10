import Image from "next/image";

import { AuthButton } from "./auth/auth-button";
import { UserButton } from "./auth/user-button";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { Button } from "./ui/button";

import { currentUser } from "@/lib/auth";

export const Header = async () => {
  const user = await currentUser();
  return (
    <header className="text-pri sticky top-0 z-50 bg-white ">
      <MaxWidthWrapper className="relative flex items-center justify-between py-4">
        <nav className="">
          <ul className="flex items-center space-x-6">
            <a href="/">
              <Image
                src={"/images/oh-logo.png"}
                alt="logo"
                width={40}
                height={40}
              />
            </a>
            <li>
              <a href="/" className="text-sm ">
                Learning capsules
              </a>
            </li>
            <li>
              <a href="/" className="text-sm">
                Coaching
              </a>
            </li>
            <li>
              <a href="/" className="text-sm">
                Our clubs
              </a>
            </li>
            <li>
              <a href="/" className="text-sm">
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
              <Button variant="ghost" size="sm">
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
