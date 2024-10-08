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

import { env } from "@/env";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { passwordResetToken, user } from "@/server/db/schema";
import {
  AuthRegisterSchema,
  AuthResetPasswordSchema,
  AuthUpdatePasswordSchema,
} from "@/types";
import { Stripe } from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(AuthRegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, code } = input;
      const { db } = ctx;

      const hashedPassword = await bcrypt.hash(password, 10);
      let existingUser = await getUserByEmail({ db, email });

      if (existingUser) {
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
        } catch (e) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong, please try again later.",
            cause: e,
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
      const name = existingToken.email.split("@")[0];

      let customer: Stripe.Response<Stripe.Customer>;
      try {
        customer = await stripe.customers.create({
          email,
          name,
        });
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not create stripe customer. Please try again later.",
        });
      }

      const [createdUser] = await db
        .insert(user)
        .values({
          id: userId,
          name,
          email,
          password: hashedPassword,
          stripeCustomerId: customer.id,
        })
        .returning();

      return { createdUser };
    }),

  reset: publicProcedure
    .input(AuthResetPasswordSchema)
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

      try {
        await sendPasswordResetEmail({
          token: passwordResetToken.token,
          email: passwordResetToken.email,
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again later.",
          cause: e,
        });
      }

      return { success: "Reset email sent!" };
    }),

  newPassword: publicProcedure
    .input(
      z.object({
        token: z.nullable(z.string()),
        values: AuthUpdatePasswordSchema,
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
        .update(user)
        .set({
          password: hashedPassword,
        })
        .where(eq(user.id, existingUser.id));

      await db
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.token, token));

      return { success: "Password updated!" };
    }),
});
