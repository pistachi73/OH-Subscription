"use client";

import { useSignals } from "@preact/signals-react/runtime";
import { BadgeCheck } from "lucide-react";

import { AuthProvider } from "./auth-form-context";
import { parentFormSignal } from "./auth-signals";
import { type AuthFormType } from "./auth.types";

import { useAuthContext } from "@/components/auth/auth-form-context";
import { LoginForm } from "@/components/auth/login-form";
import { NewPasswordForm } from "@/components/auth/new-password-form";
import { RegisterForm } from "@/components/auth/register-form";

const checkPoints = [
  "Learn English from the news and from your favourite songs",
  "Get 1to1 coaching sessions",
  "Access to tons of interactive content",
  "Connect with other English students",
];

type AuthFormProps = {
  initialFormType: AuthFormType;
};

export const AuthFormContentSignals = () => {
  useSignals();

  return (
    <div className="flex h-[100vh] w-full  flex-row overflow-hidden rounded-none border-none bg-white p-0 sm:h-[800px] sm:max-h-[90vh] sm:w-[475px] sm:rounded-md lg:w-[900px]">
      <div className="relative hidden min-h-full w-full basis-1/2 bg-red-100 bg-[url(/images/auth-left.jpeg)] bg-cover bg-left lg:block">
        <div className="h-full bg-primary-800 bg-opacity-80 p-10">
          {parentFormSignal.value !== "reset-password" && (
            <>
              <h3 className="py-6 text-3xl font-semibold leading-tight tracking-tight text-white">
                The only suscription you need.
              </h3>
              <ul className="space-y-4 py-4 text-white">
                {checkPoints.map((checkPoint, index) => (
                  <li key={index} className="flex items-start gap-2 text-lg">
                    <div className="flex h-7 items-center justify-center">
                      <BadgeCheck size={20} />{" "}
                    </div>
                    <p>{checkPoint}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="items flex min-h-full flex-col justify-between gap-6 overflow-y-auto px-10 py-8 lg:basis-1/2">
        {parentFormSignal.value === "login" && <LoginForm />}
        {parentFormSignal.value === "register" && <RegisterForm />}
        {parentFormSignal.value === "reset-password" && <NewPasswordForm />}
        <p className="text-xs font-light leading-5 text-muted-foreground ">
          By joining, you agree to the OH Subscription Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

export const AuthFormContent = () => {
  const { parentForm } = useAuthContext();

  return (
    <div className="flex h-[100vh] w-full  flex-row overflow-hidden rounded-none border-none bg-white p-0 sm:h-[800px] sm:max-h-[90vh] sm:w-[475px] sm:rounded-md lg:w-[900px]">
      <div className="relative hidden min-h-full w-full basis-1/2 bg-red-100 bg-[url(/images/auth-left.jpeg)] bg-cover bg-left lg:block">
        <div className="h-full bg-primary-800 bg-opacity-80 p-10">
          {parentForm !== "reset-password" && (
            <>
              <h3 className="py-6 text-3xl font-semibold leading-tight tracking-tight text-white">
                The only suscription you need.
              </h3>
              <ul className="space-y-4 py-4 text-white">
                {checkPoints.map((checkPoint, index) => (
                  <li key={index} className="flex items-start gap-2 text-lg">
                    <div className="flex h-7 items-center justify-center">
                      <BadgeCheck size={20} />{" "}
                    </div>
                    <p>{checkPoint}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="items flex min-h-full flex-col justify-between gap-6 overflow-y-auto px-10 py-8 lg:basis-1/2">
        {parentForm === "login" && <LoginForm />}
        {parentForm === "register" && <RegisterForm />}
        {parentForm === "reset-password" && <NewPasswordForm />}
        <p className="text-xs font-light leading-5 text-muted-foreground ">
          By joining, you agree to the OH Subscription Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

export const AuthForm = ({ initialFormType }: AuthFormProps) => {
  return (
    <AuthProvider initialFormType={initialFormType}>
      <AuthFormContent />
    </AuthProvider>
  );
};
