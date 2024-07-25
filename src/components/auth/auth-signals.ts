import { signal } from "@preact/signals-react";

export const isAuthModalOpenSignal = signal(false);
export const needsAuthModalRedirectSignal = signal(true);
export const authModalRedirectToIfNotSubscribed = signal<string | undefined>(
  undefined,
);
