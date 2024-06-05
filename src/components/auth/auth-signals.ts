import { signal } from "@preact/signals-react";

export const isAuthModalOpenSignal = signal(false);
export const needsAuthModalRedirectSignal = signal(true);
