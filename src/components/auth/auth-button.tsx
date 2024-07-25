"use client";

import { useSignals } from "@preact/signals-react/runtime";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import {
  authModalRedirectToIfNotSubscribed,
  isAuthModalOpenSignal,
  needsAuthModalRedirectSignal,
} from "./auth-signals";

type LoginButtonProps = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  callbackUrl?: string;
  asChild?: boolean;
  className?: string;
  redirect?: boolean;
  redirectToIfNotSubscribed?: string;
};

export const AuthButton = ({
  children,
  callbackUrl,
  mode = "modal",
  asChild,
  className,
  redirect = true,
  redirectToIfNotSubscribed,
}: LoginButtonProps) => {
  useSignals();
  const router = useRouter();

  const onClick = () => {
    if (mode === "redirect") {
      router.push(`/login/${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`);
    } else {
      isAuthModalOpenSignal.value = true;
      needsAuthModalRedirectSignal.value = redirect;
      authModalRedirectToIfNotSubscribed.value = redirect
        ? redirectToIfNotSubscribed
        : undefined;
    }
  };

  const Comp = asChild ? Slot : "button";

  //CHANGE THIS TO BUTTON AND USE AS CHILD
  return (
    <Comp
      onClick={onClick}
      className={cn("cursor-pointer", className)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
    >
      {children}
    </Comp>
  );
};
