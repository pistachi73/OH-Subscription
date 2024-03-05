import { eq } from "drizzle-orm";

import { type SharedLib } from "./lib.types";

import { passwordResetTokens } from "@/server/db/schema";

export const getPasswordResetTokenByToken = async ({
  db,
  token,
}: { token: string } & SharedLib) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async ({
  db,
  email,
}: { email: string } & SharedLib) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};
