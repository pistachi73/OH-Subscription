"use client";

import { useSignals } from "@preact/signals-react/runtime";
import { isAuthModalOpenSignal } from "./auth-signals";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import { Auth } from "./auth";

export const AuthModal = () => {
  useSignals();

  return (
    <ResponsiveDialog
      open={isAuthModalOpenSignal.value}
      onOpenChange={(isOpen) => {
        isAuthModalOpenSignal.value = isOpen;
      }}
    >
      <ResponsiveDialogContent className="h-full  max-w-max sm:border-none sm:h-auto sm:w-auto bg-background p-0">
        <Auth className="border-none" />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
