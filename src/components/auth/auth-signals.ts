import { signal } from "@preact/signals-react";

import {
  type AuthFormType,
  type LoginFormType,
  type RegisterFormType,
} from "./auth.types";

export const parentFormSignal = signal<AuthFormType>("login");
export const childrenFormSignal = signal<RegisterFormType | LoginFormType>(
  "default",
);
export const emailSignal = signal<string | null>(null);
export const isAuthModalOpenSignal = signal(false);
