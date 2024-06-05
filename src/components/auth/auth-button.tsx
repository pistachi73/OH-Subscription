"use client";

import { useSignals } from "@preact/signals-react/runtime";

import { useRouter } from "next/navigation";

import {
  isAuthModalOpenSignal,
  needsAuthModalRedirectSignal,
} from "./auth-signals";

type LoginButtonProps = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  callbackUrl?: string;
  asChild?: boolean;
  redirect?: boolean;
};

export const AuthButton = ({
  children,
  callbackUrl,
  mode,
  redirect = true,
}: LoginButtonProps) => {
  useSignals();
  const router = useRouter();

  const onClick = () => {
    if (mode === "redirect") {
      router.push(`/login/${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`);
    } else {
      isAuthModalOpenSignal.value = true;
      needsAuthModalRedirectSignal.value = redirect;
    }
  };

  //CHANGE THIS TO BUTTON AND USE AS CHILD
  return (
    <span
      onClick={onClick}
      className="cursor-pointer"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
    >
      {children}
    </span>
  );
};
