import { signal } from "@preact/signals-react";

export const isAuthModalOpenSignal = signal(false);
export const authModalRedirectToSignal = signal<string | undefined>(undefined);
export const authModalRedirectToIfNotSubscribed = signal<string | undefined>(
  undefined,
);
