"use client";

import { useRouter } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { type AuthFormType } from "@/components/auth/auth.types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type LoginButtonProps = {
  children: React.ReactNode;
  formType: AuthFormType;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

export const AuthButton = ({
  formType,
  children,
  asChild,
  mode,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/auth/${formType || "login"}`);
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="h-full w-full max-w-max border-none p-0 sm:h-auto sm:w-auto">
          <AuthForm initialFormType="register" />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
