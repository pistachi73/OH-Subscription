"use client";

import { useUserStatus } from "@/hooks/use-user-status";
import Link from "next/link";
import { AuthButton } from "../auth/auth-button";

type UserStatusLinkProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
  asChild?: boolean;
  requiredSubscription?: boolean;
};

export const UserStatusLink = ({
  children,
  href,
  className,
  asChild = false,
  requiredSubscription = true,
  ...props
}: UserStatusLinkProps) => {
  const userStatus = useUserStatus();

  if (
    userStatus === "LOGGED_IN_SUBSCRIBED" ||
    (userStatus === "LOGGED_IN_UNSUBSCRIBED" && !requiredSubscription)
  ) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  if (userStatus === "LOGGED_IN_UNSUBSCRIBED") {
    return (
      <Link href={"/plans"} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <AuthButton
      redirectToIfNotSubscribed={"/plans"}
      redirectTo={href}
      className={className}
    >
      {children}
    </AuthButton>
  );
};
