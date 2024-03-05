import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { getPasswordResetTokenByToken } from "../lib/password-reset-token";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "../lib/tokens";
import { getUserByEmail } from "../lib/user";
import { getVerificationTokenByToken } from "../lib/verification-token";

import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { NewPasswordSchema, RegisterSchema, ResetSchema } from "@/schemas";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  passwordResetTokens,
  users,
  verificationTokens,
} from "@/server/db/schema";

export const authRouter = createTRPCRouter({
  register: publicProcedure

    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, name, password, code } = input;
      const { db } = ctx;

      const hashedPassword = await bcrypt.hash(password, 10);
      let existingUser = await getUserByEmail({ db, email });

      if (existingUser) {
        console.log("Email already in use!");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already in use!",
          cause: "email",
        });
      }

      if (!code) {
        const verificationToken = await generateVerificationToken({
          db,
          email,
        });

        try {
          await sendVerificationEmail({
            email: verificationToken.email,
            token: verificationToken.token,
          });
        } catch {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wront, please try again later.",
          });
        }

        return { emailVerification: true };
      }

      const existingToken = await getVerificationTokenByToken({
        token: code,
        db,
      });

      if (!existingToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token!",
        });
      }

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token has expired!",
        });
      }

      existingUser = await getUserByEmail({
        db,
        email: existingToken.email,
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already in use!",
        });
      }

      const userId = uuid();

      await db.insert(users).values({
        id: userId,
        name,
        email,
        password: hashedPassword,
      });

      return { success: "User created!" };
    }),

  newVerification: publicProcedure
    .input(
      z.object({
        token: z.nullable(z.string()),
      }),
    )
    .mutation(async ({ input: { token }, ctx: { db } }) => {
      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing token!",
        });
      }

      const existingToken = await getVerificationTokenByToken({
        token,
        db,
      });

      if (!existingToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token!",
        });
      }

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token has expired!",
        });
      }

      const existingUser = await getUserByEmail({
        db,
        email: existingToken.email,
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email does not exist!",
        });
      }

      await db
        .update(users)
        .set({
          emailVerified: new Date(),
          email: existingToken.email,
        })
        .where(eq(users.id, existingUser.id));

      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, token));

      return { success: "Email verified!" };
    }),

  reset: publicProcedure
    .input(ResetSchema)
    .mutation(async ({ input: { email }, ctx: { db } }) => {
      const existingUser = await getUserByEmail({ email, db });

      if (!existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not found!",
        });
      }

      const passwordResetToken = await generatePasswordResetToken({
        db,
        email,
      });

      await sendPasswordResetEmail({
        token: passwordResetToken.token,
        email: passwordResetToken.email,
      });

      return { success: "Reset email sent!" };
    }),

  newPassword: publicProcedure
    .input(
      z.object({
        token: z.nullable(z.string()),
        values: NewPasswordSchema,
      }),
    )
    .mutation(async ({ input: { token, values }, ctx: { db } }) => {
      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing token!",
        });
      }

      const { password } = values;

      const existingToken = await getPasswordResetTokenByToken({ db, token });

      if (!existingToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token!",
        });
      }

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token has expired!",
        });
      }

      const existingUser = await getUserByEmail({
        db,
        email: existingToken.email,
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email does not exist!",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));

      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.token, token));

      return { success: "Password updated!" };
    }),
});
