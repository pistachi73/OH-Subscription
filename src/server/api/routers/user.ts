import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { generateVerificationToken } from "../lib/tokens";
import { getUserByEmail, getUserById } from "../lib/user";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { sendVerificationEmail } from "@/lib/mail";
import { SettingsSchema } from "@/schemas";
import { users } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  updateSettings: protectedProcedure.input(SettingsSchema).mutation(
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
        input.password = undefined;
        input.newPassword = undefined;
        input.isTwoFactorEnabled = undefined;
      }

      if (input.email && input.email !== user.email) {
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
        } catch {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong!",
          });
        }

        return { success: "Verification email sent!" };
      }

      if (input.password && input.newPassword && dbUser.password) {
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

        const hashedPassword = await bcrypt.hash(input.newPassword, 10);

        input.password = hashedPassword;
        input.newPassword = undefined;
      }

      await db.update(users).set(input).where(eq(users.id, dbUser.id));

      return { success: "User settings updated!" };
    },
  ),
});
