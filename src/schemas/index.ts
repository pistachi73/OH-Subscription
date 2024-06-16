import * as z from "zod";

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
      return file.size <= 3000000;
    }
    return true;
  }, "Max image size is 3MB.");

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
});

export const VideosOnProgramsSchema = z.object({
  programId: z.number(),
  videoId: z.number(),
  chapterNumber: z.number().optional(),
});
export const TeachersOnProgramsSchema = z.object({
  programId: z.number(),
  teacherId: z.number(),
});

export const CategoriesOnProgramsSchema = z.object({
  programId: z.number(),
  categoryId: z.number(),
});

export const TeacherSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  bio: z.string().min(1, { message: "Bio is required" }),
  image: FileSchema,
});

export const ShotSchema = z.object({
  id: z.number().optional(),
  playbackId: z.string().min(1, { message: "Playback ID is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  transcript: z.string().optional(),
});

export const CategoriesOnShotsSchema = z.object({
  shotId: z.number(),
  categoryId: z.number(),
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

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
});

export const CommentSchema = z.object({
  id: z.number().optional(),
  content: z.string().min(1, { message: "Content is required" }),
  videoId: z.number().optional(),
  programId: z.number().optional(),
  shotId: z.number().optional(),
  parentCommentId: z.number().optional(),
  userId: z.string(),
});

export const ReplySchema = z.object({
  id: z.number().optional(),
  content: z.string().min(1, { message: "Content is required" }),
  commentId: z.number().optional(),
  userId: z.string(),
});

export const AuthSchema = z
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

export const AuthRegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: PasswordSchema,
  code: z.string().optional(),
});
