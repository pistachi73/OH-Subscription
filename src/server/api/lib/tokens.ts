import crypto from "crypto";

import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

import { type SharedLib } from "./lib.types";
import { getPasswordResetTokenByEmail } from "./password-reset-token";
import { getTwoFactorTokenByEmail } from "./two-factor-token";
import { getVerificationTokenByEmail } from "./verification-token";

import {
  passwordResetTokens,
  twoFactorTokens,
  verificationTokens,
} from "@/server/db/schema";

export const generateVerificationToken = async ({
  db,
  email,
}: SharedLib & { email: string }) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getVerificationTokenByEmail({ db, email });

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email));
  }

  const data = { token, email, expires };
  await db.insert(verificationTokens).values(data);

  return data;
};

export const generatePasswordResetToken = async ({
  db,
  email,
}: SharedLib & { email: string }) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail({ db, email });

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email));
  }

  const data = { token, email, expires };

  await db.insert(passwordResetTokens).values(data);

  return data;
};

export const generateTwoFactorToken = async ({
  db,
  email,
}: SharedLib & { email: string }) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail({ db, email });

  if (existingToken) {
    await db
      .delete(twoFactorTokens)
      .where(eq(twoFactorTokens.token, existingToken.token));
  }

  const data = { token, email, expires };

  await db.insert(twoFactorTokens).values(data);

  return data;
};
