"use client";

import { BsCheck2Circle } from "react-icons/bs";

import { AuthProvider } from "./auth-form-context";
import { type AuthFormType } from "./auth.types";

import { useAuthContext } from "@/components/auth/auth-form-context";
import { LoginForm } from "@/components/auth/login-form";
import { NewPasswordForm } from "@/components/auth/new-password-form";
import { RegisterForm } from "@/components/auth/register-form";

const checkPoints = [
  "Add your check points here",
  "Add your check points here",
  "Add your check points here",
  "Add your check points here",
];

type AuthFormProps = {
  initialFormType: AuthFormType;
};

const AuthFormContent = () => {
  const { parentForm } = useAuthContext();

  return (
    <div className="flex h-[100vh] w-full  flex-row overflow-hidden rounded-none border-none bg-white p-0 sm:h-[745px] sm:max-h-[90vh] sm:w-[475px] sm:rounded-md lg:w-[875px]">
      <div className="relative hidden min-h-full w-full basis-1/2 bg-red-100 bg-[url(/images/auth-left.jpeg)] bg-cover lg:block">
        <div className="h-full bg-slate-900 bg-opacity-35 p-10">
          {parentForm !== "reset-password" && (
            <>
              <h3 className="py-6 text-3xl font-semibold tracking-tight text-white">
                The only suscription you need
              </h3>
              {/* <ul className="space-y-4 py-4 text-lg text-white">
                {checkPoints.map((checkPoint, index) => (
                  <li key={index} className="flex items-start gap-2 text-xl">
                    <div className="flex h-7 items-center justify-center">
                      <BsCheck2Circle size={20} />{" "}
                    </div>
                    <p>{checkPoint}</p>
                  </li>
                ))}
              </ul> */}
            </>
          )}
        </div>
      </div>
      <div className="items flex min-h-full flex-col justify-between gap-6 overflow-scroll px-10 py-8 lg:basis-1/2">
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
