"use client";

import { useSignals } from "@preact/signals-react/runtime";

import { AuthForm, AuthFormContent, AuthFormContentSignals } from "./auth-form";
import { isAuthModalOpenSignal } from "./auth-signals";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export const AuthModal = () => {
  useSignals();

  return (
    <Dialog
      open={isAuthModalOpenSignal.value}
      onOpenChange={(isOpen) => {
        isAuthModalOpenSignal.value = isOpen;
      }}
    >
      <DialogContent className="h-full w-full max-w-max border-none p-0 sm:h-auto sm:w-auto">
        <AuthFormContentSignals />
      </DialogContent>
    </Dialog>
  );
};
