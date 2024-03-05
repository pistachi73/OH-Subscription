"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { type IconType } from "react-icons/lib";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

type Provider = "google" | "github";

const socialButtonMapping: Record<
  Provider,
  {
    label: string;
    provider: Provider;
    icon: IconType;
  }
> = {
  google: {
    label: "Continue with google",
    provider: "google",
    icon: FcGoogle,
  },
  github: {
    label: "Continue with Github",
    provider: "github",
    icon: FaGithub,
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
      <Icon size={18} />
      <span className="block w-full text-center">{label}</span>
    </Button>
  );
};
