"use client";

import { useSignals } from "@preact/signals-react/runtime";

import { useRouter } from "next/navigation";

import { isAuthModalOpenSignal, parentFormSignal } from "./auth-signals";

import { type AuthFormType } from "@/components/auth/auth.types";

type LoginButtonProps = {
  children: React.ReactNode;
  formType: AuthFormType;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

export const AuthButton = ({ formType, children, mode }: LoginButtonProps) => {
  useSignals();
  const router = useRouter();

  const onClick = () => {
    if (mode === "redirect") {
      router.push(`/auth/${formType || "login"}`);
    } else {
      isAuthModalOpenSignal.value = true;
      parentFormSignal.value = formType;
    }
  };

  // if (mode === "modal") {
  //   return (
  //     <Dialog>
  //       <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
  //       <DialogContent className="h-full w-full max-w-max border-none p-0 sm:h-auto sm:w-auto">
  //         <AuthForm initialFormType={formType} />
  //       </DialogContent>
  //     </Dialog>
  //   );
  // }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
