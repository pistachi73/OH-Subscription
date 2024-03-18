"use client";

import { signIn } from "next-auth/react";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/icons/github-icon";
import { GoogleIcon } from "@/components/ui/icons/google-icon";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

type Provider = "google" | "github";

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
  github: {
    label: "Continue with Github",
    provider: "github",
    icon: GithubIcon,
  },
};

type SocialButtonProps = {
  provider: Provider;
  className?: string;
};

export const SocialButton = ({ provider, className }: SocialButtonProps) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = () => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  const { label, icon: Icon } = socialButtonMapping[provider];

  return (
    <Button
      size="default"
      variant="outline"
      className={cn("flex w-full justify-between border", className)}
      onClick={onClick}
    >
      <Icon className="h-[18px] w-[18px]" />
      <span className="block w-full text-center">{label}</span>
    </Button>
  );
};
