"use client";

import { signIn } from "next-auth/react";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AppleIcon, FacebookIcon, GoogleIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSignals } from "@preact/signals-react/runtime";
import { authModalRedirectToSignal } from "./auth-signals";

type Provider = "google" | "facebook" | "apple";

const socialButtonMapping: Record<
  Provider,
  {
    label: string;
    provider: Provider;
    icon: ({ className }: { className: string }) => JSX.Element;
  }
> = {
  google: {
    label: "Continue with google",
    provider: "google",
    icon: GoogleIcon,
  },
  facebook: {
    label: "Continue with Facebook",
    provider: "facebook",
    icon: FacebookIcon,
  },
  apple: {
    label: "Continue with Apple",
    provider: "apple",
    icon: AppleIcon,
  },
};

type SocialButtonProps = {
  provider: Provider;
  className?: string;
};

export const SocialButton = ({ provider, className }: SocialButtonProps) => {
  useSignals();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = () => {
    const redirectTo =
      callbackUrl ?? authModalRedirectToSignal.value ?? DEFAULT_LOGIN_REDIRECT;
    signIn(provider, {
      callbackUrl: redirectTo,
    });
  };

  const { label, icon: Icon } = socialButtonMapping[provider];

  return (
    <Button
      size="lg"
      variant="outline"
      className={cn(
        "flex w-full justify-between border text-sm sm:text-base",
        className,
      )}
      type="button"
      onClick={onClick}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px]",
          provider === "apple" && "fill-foreground",
        )}
      />
      <span className="block w-full text-center">{label}</span>
    </Button>
  );
};
