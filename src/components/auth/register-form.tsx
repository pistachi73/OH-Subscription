"use client";
import { BsEnvelope } from "react-icons/bs";

import { useAuthContext } from "./auth-form-context";

import { type RegisterFormType } from "@/components/auth/auth.types";
import { CredentialsRegisterForm } from "@/components/auth/credentials-register-form";
import { FormWrapper } from "@/components/auth/form-wrapper";
import { SocialButton } from "@/components/auth/social-button";
import { Button } from "@/components/ui/button";

export const RegisterForm = () => {
  const { setParentForm, setChildrenForm, childrenForm, email } =
    useAuthContext();

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
          className="font-light text-primary"
          onClick={() => {
            setParentForm("login");
            setChildrenForm("default");
          }}
        >
          Sign in
        </Button>
      </span>
    ),
    credential: null,
    "email-verification": email
      ? `Enter the confirmation code we sent to ${email}.`
      : "Enter the confirmation code we sent to your email.",
  };

  return (
    <FormWrapper
      header={headerLabelMapping[childrenForm as RegisterFormType]}
      subHeader={subHeaderMapping[childrenForm as RegisterFormType]}
      backButton={childrenForm !== "default"}
      backButtonOnClick={() => {
        setChildrenForm("default");
      }}
    >
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
              Continue with email
            </span>
          </Button>
          <span className=" block w-full text-center text-xs font-medium text-muted-foreground">
            OR
          </span>
          <SocialButton provider="github" />
        </div>
      )}
      {(childrenForm === "credential" ||
        childrenForm === "email-verification") && <CredentialsRegisterForm />}
    </FormWrapper>
  );
};
