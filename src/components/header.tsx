import { AuthButton } from "./auth/auth-button";
import { UserButton } from "./auth/user-button";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { Button } from "./ui/button";

import { currentUser } from "@/lib/auth";

export const Header = async () => {
  const user = await currentUser();
  return (
    <header className="border-b border-input bg-background">
      <MaxWidthWrapper className="flex items-center justify-between py-4">
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <a href="/">Learning capsules</a>
            </li>
            <li>
              <a href="/">Coaching</a>
            </li>
            <li>
              <a href="/">Our clubs</a>
            </li>
            <li>
              <a href="/">Podcast</a>
            </li>
          </ul>
        </nav>
        {user ? (
          <UserButton user={user} />
        ) : (
          <div className="flex flex-row gap-2">
            <AuthButton asChild mode="modal" formType="login">
              <Button variant="ghost" size="lg">
                Log in
              </Button>
            </AuthButton>
            <AuthButton asChild mode="modal" formType="register">
              <Button variant="default" size="lg">
                Sign in
              </Button>
            </AuthButton>
          </div>
        )}
      </MaxWidthWrapper>
    </header>
  );
};
