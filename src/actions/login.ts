"use server";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { v4 as uuid } from "uuid";
import type { z } from "zod";

import { signIn } from "@/auth";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/server/api/lib/tokens";
import { getTwoFactorConirmationByUserId } from "@/server/api/lib/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/server/api/lib/two-factor-token";
import { getUserByEmail } from "@/server/api/lib/user";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { LoginSchema } from "@/types";

export const login = async (
  credentials: z.infer<typeof LoginSchema>,
): Promise<{
  error?: string;
  success?: string;
  twoFactor?: boolean;
  isSubscribed?: boolean;
}> => {
  const verifiedCredentials = LoginSchema.safeParse(credentials);

  if (!verifiedCredentials.success) {
    return { error: "Invalid fields" };
  }
  const { email, password, code } = verifiedCredentials.data;

  const existingUser = await getUserByEmail({ db, email });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail({ db, email });

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired! " };
      }

      await db
        .delete(schema.twoFactorToken)
        .where(eq(schema.twoFactorToken.token, code));

      const existingConfirmation = await getTwoFactorConirmationByUserId({
        db,
        userId: existingUser.id,
      });

      if (existingConfirmation) {
        db.delete(schema.twoFactorConirmation).where(
          eq(schema.twoFactorConirmation.id, existingConfirmation.id),
        );
      }

      await db.insert(schema.twoFactorConirmation).values({
        id: uuid(),
        userId: existingUser.id,
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken({
        db,
        email: existingUser.email,
      });

      try {
        await sendTwoFactorTokenEmail({
          token: twoFactorToken.token,
          email: existingUser.email,
        });
      } catch (error) {
        return { error: "Someghing went wrong!" };
      }

      return {
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };

        default:
          return { error: "Something went wrong!" };
      }
    }

    return { error: "Something went wrong!" };
  }

  return {
    success: "Login successful",
    isSubscribed: existingUser.stripeSubscriptionEndsOn
      ? (existingUser.stripeSubscriptionEndsOn as Date) > new Date()
      : false,
  };
};
