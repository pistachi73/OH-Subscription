"use client";

import { useSignals } from "@preact/signals-react/runtime";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import {
  authModalRedirectToIfNotSubscribed,
  authModalRedirectToSignal,
  isAuthModalOpenSignal,
} from "./auth-signals";

type LoginButtonProps = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  callbackUrl?: string;
  asChild?: boolean;
  className?: string;
  redirectTo?: string;
  redirectToIfNotSubscribed?: string;
};

export const AuthButton = ({
  children,
  callbackUrl,
  mode = "modal",
  asChild,
  className,
  redirectTo,
  redirectToIfNotSubscribed,
}: LoginButtonProps) => {
  useSignals();
  const router = useRouter();

  const onClick = () => {
    if (mode === "redirect") {
      router.push(`/login/${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`);
    } else {
      isAuthModalOpenSignal.value = true;
      authModalRedirectToSignal.value = redirectTo;
      authModalRedirectToIfNotSubscribed.value = redirectToIfNotSubscribed;
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
