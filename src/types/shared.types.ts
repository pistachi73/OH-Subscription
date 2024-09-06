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

export const extendBaseSchemasWithSourceId = <T extends z.ZodRawShape>(
  BaseSchema: z.ZodObject<T>,
) => {
  return z.union(
    [
      BaseSchema.extend({
        programId: z.number(),
        videoId: z.never().optional(),
        shotId: z.never().optional(),
        commentId: z.never().optional(),
      }).strict(),
      BaseSchema.extend({
        programId: z.never().optional(),
        videoId: z.number(),
        shotId: z.never().optional(),
        commentId: z.never().optional(),
      }).strict(),
      BaseSchema.extend({
        programId: z.never().optional(),
        videoId: z.never().optional(),
        shotId: z.number(),
        commentId: z.never().optional(),
      }).strict(),
      BaseSchema.extend({
        programId: z.never().optional(),
        videoId: z.never().optional(),
        shotId: z.never().optional(),
        commentId: z.number(),
      }),
    ],
    {
      errorMap: () => {
        return {
          code: "BAD_REQUEST",
          message:
            "Invalid input. Specify one of the following source Ids: programId, videoId, shotId, parentCommentId",
        };
      },
    },
  );
};

export const isFromProgramSource = <T>(
  data: T,
): data is T & { programId: number } => {
  return (data as any).programId !== undefined;
};

export const isFromVideoSource = <T>(
  data: T,
): data is T & { videoId: number } => {
  return (data as any).videoId !== undefined;
};

export const isFromShotSource = <T>(
  data: T,
): data is T & { shotId: number } => {
  return (data as any).shotId !== undefined;
};

export const isFromCommentSource = <T>(
  data: T,
): data is T & { commentId: number } => {
  return (data as any).commentId !== undefined;
};
