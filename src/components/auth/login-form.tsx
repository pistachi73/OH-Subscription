"use client";

import { useEffect } from "react";
import { BsEnvelope } from "react-icons/bs";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";

import { useAuthContext } from "./auth-form-context";

import { type LoginFormType } from "@/components/auth/auth.types";
import { CredentialsForm } from "@/components/auth/credentials-login-form";
import { FormWrapper } from "@/components/auth/form-wrapper";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { SocialButton } from "@/components/auth/social-button";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const { setParentForm, setChildrenForm, childrenForm } = useAuthContext();

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
          className="font-light text-primary"
          onClick={() => {
            setParentForm("register");
            setChildrenForm("default");
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

  return (
    <FormWrapper
      header={headerLabelMapping[childrenForm as LoginFormType]}
      subHeader={subHeaderMapping[childrenForm as LoginFormType]}
      backButton={childrenForm !== "default"}
      backButtonOnClick={() => {
        setChildrenForm("default");
      }}
    >
      {(childrenForm === "credential" || childrenForm === "two-factor") && (
        <CredentialsForm />
      )}
      {childrenForm === "reset-password" && <ResetPasswordForm />}
      {childrenForm === "default" && (
        <div className="space-y-4">
          <SocialButton provider="google" />
          <Button
            size="default"
            variant="outline"
            className="flex w-full justify-between"
            onClick={() => {
              setChildrenForm("credential");
            }}
          >
            <BsEnvelope size={18} />
            <span className="block w-full text-center">
              Continue with email/username
            </span>
          </Button>
          <span className=" block w-full text-center text-xs font-medium text-muted-foreground">
            OR
          </span>
          <SocialButton provider="github" />
        </div>
      )}
    </FormWrapper>
  );
};
