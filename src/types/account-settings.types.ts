import { z } from "zod";
import { PasswordSchema } from "./shared.types";

export const AccountSettingsSchema = z
  .object({
    name: z.string().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    email: z.string().email().optional(),
    verifycationToken: z.string().optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    currentPassword: z.string().optional(),
    password: PasswordSchema.optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      path: ["currentPassword"],
      message: "Current password is required!",
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });
