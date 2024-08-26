"use client";

import { cn } from "@/lib/utils/cn";
import { AuthSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Form } from "../ui/form";
import { AuthProvider, useAuthContext } from "./auth-context";
import { AuthCreatePassword } from "./auth-create-password";
import { AuthEmailVerification } from "./auth-email-verification";
import { AuthEnterPassword } from "./auth-enter-password";
import { AuthLanding } from "./auth-landing";
import { AuthResetPassword } from "./auth-reset-password";
import { AuthTwoFactor } from "./auth-two-factor";
import { AuthUpdatePassword } from "./auth-update-password";

const checkPoints = [
  "Learn English from the news and from your favourite songs",
  "Get 1to1 coaching sessions",
  "Access to tons of interactive content",
  "Connect with other English students",
];

export type AuthSteps =
  | "LANDING"
  | "VERIFY_EMAIL"
  | "OAUTH"
  | "CREATE_PASSWORD"
  | "CONFIRM_PASSWORD"
  | "ENTER_PASSWORD"
  | "TWO_FACTOR"
  | "RESET_PASSWORD"
  | "UPDATE_PASSWORD";

type AuthForm = UseFormReturn<z.infer<typeof AuthSchema>>;

export type AuthFormSharedProps = {
  authForm: AuthForm;
};

export const AuthContent = ({ className }: { className?: string }) => {
  const { formType } = useAuthContext();
  const authForm: AuthForm = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      registerPassword: "",
      registerPasswordConfirm: "",
      loginPassword: "",
      code: "",
    },
    mode: "onChange",
  });

  return (
    <div
      className={cn(
        "flex h-full w-full  flex-row overflow-hidden rounded-none p-0 sm:h-[800px] sm:max-h-[80vh] sm:w-[475px] sm:rounded-lg lg:w-[900px] shadow-sm border border-accent",
        className,
      )}
    >
      <div className="relative hidden min-h-full w-full basis-1/2 bg-red-100 bg-[url(/images/auth-left.jpeg)] bg-cover bg-left lg:block">
        <div className="h-full bg-primary-800/70 dark:bg-primary-800/80 p-10">
          <>
            <h3 className="text-balance py-6 text-xl sm:text-2xl font-semibold leading-tight tracking-tight text-background dark:text-foreground">
              The only suscription you need.
            </h3>
            <ul className="space-y-4 py-4 text-white">
              {checkPoints.map((checkPoint, index) => (
                <li key={index} className="flex items-start gap-2 text-lg">
                  <div className="flex h-7 items-center justify-center text-secondary">
                    <BadgeCheck size={20} strokeWidth={2} />{" "}
                  </div>
                  <p className="text-background dark:text-foreground text-base">
                    {checkPoint}
                  </p>
                </li>
              ))}
            </ul>
          </>
        </div>
      </div>
      <div className="relative flex min-h-full flex-col justify-between gap-6 overflow-y-auto px-10 py-8 lg:basis-1/2 bg-background w-full">
        <Form {...authForm}>
          <AnimatePresence initial={false} mode="wait">
            {formType === "LANDING" && (
              <AuthLanding key={formType} authForm={authForm} />
            )}
            {formType === "CREATE_PASSWORD" && (
              <AuthCreatePassword key={formType} authForm={authForm} />
            )}
            {formType === "VERIFY_EMAIL" && (
              <AuthEmailVerification key={formType} authForm={authForm} />
            )}
            {formType === "ENTER_PASSWORD" && (
              <AuthEnterPassword key={formType} authForm={authForm} />
            )}
            {formType === "RESET_PASSWORD" && (
              <AuthResetPassword key={formType} authForm={authForm} />
            )}
            {formType === "UPDATE_PASSWORD" && (
              <AuthUpdatePassword key={formType} authForm={authForm} />
            )}
            {formType === "TWO_FACTOR" && (
              <AuthTwoFactor key={formType} authForm={authForm} />
            )}
          </AnimatePresence>
        </Form>
        <p className="text-xs font-light leading-5 text-muted-foreground ">
          By joining, you agree to the OH Subscription Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

type AuthProps = {
  initialFormType?: AuthSteps;
  className?: string;
};
export const Auth = ({ initialFormType, className }: AuthProps) => {
  return (
    <AuthProvider initialFormType={initialFormType}>
      <AuthContent className={className} />
    </AuthProvider>
  );
};
