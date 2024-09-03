import * as z from "zod";
import { PasswordSchema } from "./shared.types";

export const AuthFormSchema = z
  .object({
    email: z.string().email({
      message: "Email is required",
    }),
    loginPassword: z.string().min(1, { message: "Password is required" }),
    registerPassword: PasswordSchema.optional(),
    registerPasswordConfirm: z.string(),
    code: z.string().optional(),
  })
  .refine((data) => data.registerPassword === data.registerPasswordConfirm, {
    path: ["registerPasswordConfirm"],
    message: "Passwords does not match",
  });

export const AuthUpdatePasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
});

export const AuthResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const AuthRegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: PasswordSchema,
  code: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});
