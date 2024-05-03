"use client";

import { useSignals } from "@preact/signals-react/runtime";


import { AuthFormContentSignals } from "./auth-form";
import { isAuthModalOpenSignal } from "./auth-signals";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";


export const AuthModal = () => {
  useSignals();

  return (
    <ResponsiveDialog
      open={isAuthModalOpenSignal.value}
      onOpenChange={(isOpen) => {
        isAuthModalOpenSignal.value = isOpen;
      }}
    >
      <ResponsiveDialogContent className="h-full w-full max-w-max border-none p-0 sm:h-auto sm:w-auto">
        <AuthFormContentSignals />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
