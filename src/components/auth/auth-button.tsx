"use client";

import { useSignals } from "@preact/signals-react/runtime";

import { useRouter } from "next/navigation";

import {
  isAuthModalOpenSignal,
  needsAuthModalRedirectSignal,
  parentFormSignal,
} from "./auth-signals";

import type { AuthFormType } from "@/components/auth/auth.types";

type LoginButtonProps = {
  children: React.ReactNode;
  formType: AuthFormType;
  mode?: "modal" | "redirect";
  callbackUrl?: string;
  asChild?: boolean;
  redirect?: boolean;
};

export const AuthButton = ({
  formType,
  children,
  callbackUrl,
  mode,
  redirect = true,
}: LoginButtonProps) => {
  useSignals();
  const router = useRouter();

  const onClick = () => {
    if (mode === "redirect") {
      router.push(
        `/auth/${formType || "login"}/${
          callbackUrl ? `?callbackUrl=${callbackUrl}` : ""
        }`,
      );
    } else {
      isAuthModalOpenSignal.value = true;
      parentFormSignal.value = formType;
      needsAuthModalRedirectSignal.value = redirect;
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
