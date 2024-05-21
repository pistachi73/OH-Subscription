"use client";
import { useSignals } from "@preact/signals-react/runtime";
import { Mail } from "lucide-react";

import {
  childrenFormSignal,
  emailSignal,
  parentFormSignal,
} from "./auth-signals";

import type { RegisterFormType } from "@/components/auth/auth.types";
import { CredentialsRegisterForm } from "@/components/auth/credentials-register-form";
import { FormWrapper } from "@/components/auth/form-wrapper";
import { SocialButton } from "@/components/auth/social-button";
import { Button } from "@/components/ui/button";

export const RegisterForm = () => {
  // const { setParentForm, setChildrenForm, childrenFormSignal, email } =
  //   useAuthContext();
  useSignals();
  const headerLabelMapping: Record<RegisterFormType, string> = {
    default: "Create a new account",
    credential: "Continue with your email or username",
    "email-verification": "Verify your email",
  };

  const subHeaderMapping: Record<
    RegisterFormType,
    string | null | React.ReactNode
  > = {
    default: (
      <span>
        Already have an account?{" "}
        <Button
          size="inline"
          variant="link"
          className="text-sm font-light text-primary sm:text-base"
          onClick={() => {
            // setParentForm("login");
            // setChildrenForm("default");
            parentFormSignal.value = "login";
            childrenFormSignal.value = "default";
          }}
        >
          Sign in
        </Button>
      </span>
    ),
    credential: null,
    "email-verification": emailSignal.value
      ? `Enter the confirmation code we sent to ${emailSignal.value}.`
      : "Enter the confirmation code we sent to your email.",
  };

  return (
    <FormWrapper
      header={headerLabelMapping[childrenFormSignal.value as RegisterFormType]}
      subHeader={subHeaderMapping[childrenFormSignal.value as RegisterFormType]}
      backButton={childrenFormSignal.value !== "default"}
      backButtonOnClick={() => {
        // setChildrenForm("default");
        childrenFormSignal.value = "default";
      }}
    >
      {childrenFormSignal.value === "default" && (
        <div className="space-y-4">
          <SocialButton provider="google" />
          <Button
            size="default"
            variant="outline"
            className="flex w-full justify-between border text-sm  sm:text-base"
            onClick={() => {
              // setChildrenForm("credential");
              childrenFormSignal.value = "credential";
            }}
          >
            <Mail size={18} />
            <span className="block w-full text-center">
              Continue with email
            </span>
          </Button>
          <span className=" block w-full text-center text-xs font-medium text-muted-foreground">
            OR
          </span>
          <SocialButton provider="github" />
        </div>
      )}
      {(childrenFormSignal.value === "credential" ||
        childrenFormSignal.value === "email-verification") && (
        <CredentialsRegisterForm />
      )}
    </FormWrapper>
  );
};
