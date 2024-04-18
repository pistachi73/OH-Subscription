import * as z from "zod";

export const passwordRegex = [
  {
    id: "lowercase",
    regex: new RegExp("(?=.*[a-z])"),
    message: "At least 1 lowercase letter",
  },
  {
    id: "uppercase",
    regex: new RegExp("(?=.*[A-Z])"),
    message: "At least 1 uppercase letter",
  },
  {
    id: "number",
    regex: new RegExp("(?=.*[0-9])"),
    message: "At least 1 number",
  },
  {
    id: "length",
    regex: new RegExp("(?=.{8,})"),
    message: "At least 8 characters",
  },
] as const;

export const FileSchema = z
  .custom<File>()
  .or(z.string())
  .optional()
  .refine((file) => {
    if (typeof file !== "string" && file?.size) {
      return file.size <= 3000000;
    }
    return true;
  }, `Max image size is 3MB.`);

export const PasswordSchema = z
  .string()
  .regex(passwordRegex[0].regex, { message: passwordRegex[0].message })
  .regex(passwordRegex[1].regex, { message: passwordRegex[1].message })
  .regex(passwordRegex[2].regex, { message: passwordRegex[2].message })
  .regex(passwordRegex[3].regex, { message: passwordRegex[3].message });

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: PasswordSchema,
  name: z.string().min(1, { message: "Name is required" }),
  code: z.optional(z.string()),
});

export const SettingsSchema = z
  .object({
    name: z.string().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    email: z.string().email().optional(),
    role: z.enum(["ADMIN", "USER"]),
    password: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
  })
  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  );

export const ProgramSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  published: z.boolean(),
  thumbnail: FileSchema,
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    required_error: "Level is required",
  }),
  totalChapters: z
    .number({ required_error: "Total chapters is required" })
    .min(1, { message: "Must be greater than 0" }),
  duration: z
    .number({ required_error: "Duration is required" })
    .min(1, { message: "Must be greater than 0" }),
  teachers: z.string().refine(
    (data) => {
      return data.split(",").filter(Boolean).length > 0;
    },
    { message: "Teachers are required" },
  ),
  categories: z.string().refine(
    (data) => {
      return data.split(",").filter(Boolean).length > 0;
    },
    { message: "Categories are required" },
  ),
});

export const TeacherSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  bio: z.string().min(1, { message: "Bio is required" }),
  image: FileSchema,
});

export const VideoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  url: z.string().min(1, { message: "URL is required" }),
  duration: z.number().min(1, { message: "Duration is required" }),
  transcript: z.string().optional(),
  categories: z.string().optional(),
  thumbnail: FileSchema,
});
