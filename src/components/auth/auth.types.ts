export type LoginFormType =
  | "default"
  | "two-factor"
  | "credential"
  | "reset-password";
export type RegisterFormType = "default" | "credential" | "email-verification";
export type AuthFormType = "login" | "register" | "reset-password";
