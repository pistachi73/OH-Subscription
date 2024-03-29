"use client";

import { useSignals } from "@preact/signals-react/runtime";
import { Mail } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";

import { childrenFormSignal, parentFormSignal } from "./auth-signals";

import { type LoginFormType } from "@/components/auth/auth.types";
import { CredentialsForm } from "@/components/auth/credentials-login-form";
import { FormWrapper } from "@/components/auth/form-wrapper";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { SocialButton } from "@/components/auth/social-button";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  useSignals();

  // const { setParentForm, setChildrenForm, childrenFormSignal.value } = useAuthContext();

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  useEffect(() => {
    if (urlError) {
      toast.error(urlError);
    }
  }, [urlError]);

  const headerLabelMapping: Record<LoginFormType, string> = {
    default: "Sign in to your account",
    "two-factor": "Two-factor authentication",
    credential: "Continue with your email or username",
    "reset-password": "Reset your password",
  };

  const subHeaderMapping: Record<
    LoginFormType,
    string | null | React.ReactNode
  > = {
    default: (
      <span>
        Don’t have an account?{" "}
        <Button
          size="inline"
          variant="link"
          className="text-sm font-light text-primary sm:text-base"
          onClick={() => {
            // setParentForm("register");
            // setChildrenForm("default");
            parentFormSignal.value = "register";
            childrenFormSignal.value = "default";
          }}
        >
          Join here
        </Button>
      </span>
    ),
    "two-factor": `Enter the 2FA code we emailed you to continue.`,
    credential: null,
    "reset-password":
      "Enter your email address and we'll send you a link to reset your password.",
  };

  // const isCredentialForm =
  //   childrenFormSignal.value === "credential" ||
  //   childrenFormSignal.value === "two-factor" ||
  //   childrenFormSignal.value === "credential" ||
  //   childrenFormSignal.value === "two-factor";

  // const isResetPasswordForm =
  //   childrenFormSignal.value === "reset-password" ||
  //   childrenFormSignal.value === "reset-password";

  // const isDefaultForm =
  //   childrenFormSignal.value === "default" || childrenFormSignal.value === "default";

  return (
    <FormWrapper
      header={headerLabelMapping[childrenFormSignal.value as LoginFormType]}
      subHeader={subHeaderMapping[childrenFormSignal.value as LoginFormType]}
      backButton={childrenFormSignal.value !== "default"}
      backButtonOnClick={() => {
        // setChildrenForm("default");
        childrenFormSignal.value = "default";
      }}
    >
      {(childrenFormSignal.value === "credential" ||
        childrenFormSignal.value === "two-factor") && <CredentialsForm />}
      {childrenFormSignal.value === "reset-password" && <ResetPasswordForm />}
      {childrenFormSignal.value === "default" && (
        <div className="space-y-4">
          <SocialButton provider="google" />
          <Button
            size="default"
            variant="outline"
            className="flex w-full justify-between border text-sm  sm:text-base"
            onClick={() => {
              childrenFormSignal.value = "credential";
            }}
          >
            <Mail size={18} />
            <span className="block w-full text-center">
              Continue with email/username
            </span>
          </Button>
          <span className=" block w-full text-center text-2xs font-medium text-muted-foreground sm:text-xs">
            OR
          </span>
          <SocialButton provider="github" />
        </div>
      )}
    </FormWrapper>
  );
};
