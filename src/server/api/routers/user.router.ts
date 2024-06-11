import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { generateVerificationToken } from "../lib/tokens";
import { getUserByEmail, getUserById } from "../lib/user";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { sendVerificationEmail } from "@/lib/mail";
import { SettingsSchema } from "@/schemas";
import { accounts, users } from "@/server/db/schema";
import { z } from "zod";
import { getVerificationTokenByToken } from "../lib/verification-token";

export const userRouter = createTRPCRouter({
  update: protectedProcedure.input(SettingsSchema).mutation(
    async ({
      input,
      ctx: {
        session: { user },
        db,
      },
    }) => {
      const dbUser = await getUserById({ db, id: user.id || "" });

      if (!dbUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      if (user.isOAuth) {
        input.email = undefined;
        input.currentPassword = undefined;
        input.password = undefined;
        input.confirmPassword = undefined;
        input.isTwoFactorEnabled = undefined;
      }

      if (
        input.email &&
        input.email !== user.email &&
        !input.verifycationToken
      ) {
        const existingUserWithEmail = await getUserByEmail({
          db,
          email: input.email,
        });

        if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email alredy in use!",
          });
        }

        const verificationToken = await generateVerificationToken({
          db,
          email: input.email,
        });

        try {
          await sendVerificationEmail({
            email: verificationToken.email,
            token: verificationToken.token,
          });
        } catch (e) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong!",
            cause: e,
          });
        }

        return {
          verifyEmail: true,
          email: verificationToken.email,
          token: verificationToken.token,
        };
      }

      if (
        input.email &&
        input.verifycationToken &&
        input.email !== user.email
      ) {
        console.log("verifycationToken inside", input.verifycationToken);
        const existingToken = await getVerificationTokenByToken({
          token: input.verifycationToken,
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
      }

      if (
        input.currentPassword &&
        input.password &&
        input.confirmPassword &&
        dbUser.password
      ) {
        const passwordMatch = await bcrypt.compare(
          input.password,
          dbUser.password,
        );

        if (!passwordMatch) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Incorrect password!",
          });
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        input.password = hashedPassword;
        input.currentPassword = undefined;
        input.confirmPassword = undefined;
      }

      await db.update(users).set(input).where(eq(users.id, dbUser.id));

      return { success: "User settings updated!" };
    },
  ),
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not logged in",
      });
    }

    await ctx.db.delete(users).where(eq(users.id, ctx.session.user.id));

    return { success: "User deleted successfully" };
  }),

  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx: { db } }) => {
      const user = await getUserByEmail({ db, email: input.email });
      if (user) {
        const userAccount = await db
          .select()
          .from(accounts)
          .where(eq(accounts.userId, user.id));
        return {
          user,
          account: userAccount[0],
        };
      }

      return { user };
    }),
});
