import { eq } from "drizzle-orm";

import type { SharedLib } from "./lib.types";

import { passwordResetToken } from "@/server/db/schema";

export const getPasswordResetTokenByToken = async ({
  db,
  token,
}: { token: string } & SharedLib) => {
  try {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async ({
  db,
  email,
}: { email: string } & SharedLib) => {
  try {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
  } catch {
    return null;
  }
};
