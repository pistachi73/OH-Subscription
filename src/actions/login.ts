"use server";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { v4 as uuid } from "uuid";
import { type z } from "zod";

import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { generateTwoFactorToken } from "@/server/api/lib/tokens";
import { getTwoFactorConirmationByUserId } from "@/server/api/lib/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/server/api/lib/two-factor-token";
import { getUserByEmail } from "@/server/api/lib/user";
import { db } from "@/server/db";
import { twoFactorConirmations, twoFactorTokens } from "@/server/db/schema";

export const login = async (
  credentials: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
): Promise<{
  error?: string;
  success?: string;
  newVerification?: boolean;
  twoFactor?: boolean;
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

  if (!existingUser.emailVerified) {
    return { error: "Someghing went wrong!" };
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

      await db.delete(twoFactorTokens).where(eq(twoFactorTokens.token, code));

      const existingConfirmation = await getTwoFactorConirmationByUserId({
        db,
        userId: existingUser.id,
      });

      if (existingConfirmation) {
        db.delete(twoFactorConirmations).where(
          eq(twoFactorConirmations.id, existingConfirmation.id),
        );
      }

      await db.insert(twoFactorConirmations).values({
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
      } catch {
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

  redirect(callbackUrl || DEFAULT_LOGIN_REDIRECT);
};
