"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { ShoppingBagPlayIcon } from "./icons";

type SubscribedBannerProps = {
  children?: string;
  className?: string;
};

export const SubscribedBanner = ({
  className,
  children = "Watch with a 30 day free trial",
}: SubscribedBannerProps) => {
  const user = useCurrentUser();

  if (user?.isSubscribed) return null;

  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <ShoppingBagPlayIcon className="w-5 h-5 text-secondary shrink-0" />
      <span className={cn("")}>{children}</span>
    </div>
  );
};
