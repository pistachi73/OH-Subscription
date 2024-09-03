import { z } from "zod";

export const passwordRegex = [
  {
    id: "lowercase",
    regex: /(?=.*[a-z])/,
    message: "At least 1 lowercase letter",
  },
  {
    id: "uppercase",
    regex: /(?=.*[A-Z])/,
    message: "At least 1 uppercase letter",
  },
  {
    id: "number",
    regex: /(?=.*[0-9])/,
    message: "At least 1 number",
  },
  {
    id: "length",
    regex: /(?=.{8,})/,
    message: "At least 8 characters",
  },
] as const;

export const FileSchema = z
  .custom<File>()
  .or(z.string())
  .optional()
  .refine((file) => {
    if (typeof file !== "string" && file?.size) {
      return file.size < 1000000;
    }
    return true;
  }, "Max image size is 1MB.");

export const PasswordSchema = z
  .string()
  .regex(passwordRegex[0].regex, { message: passwordRegex[0].message })
  .regex(passwordRegex[1].regex, { message: passwordRegex[1].message })
  .regex(passwordRegex[2].regex, { message: passwordRegex[2].message })
  .regex(passwordRegex[3].regex, { message: passwordRegex[3].message });
