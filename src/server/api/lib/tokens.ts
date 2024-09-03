import crypto from "node:crypto";

import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

import type { SharedLib } from "./lib.types";
import { getPasswordResetTokenByEmail } from "./password-reset-token";
import { getTwoFactorTokenByEmail } from "./two-factor-token";
import { getVerificationTokenByEmail } from "./verification-token";

import {
  passwordResetToken,
  twoFactorToken,
  verificationToken,
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
      .delete(verificationToken)
      .where(eq(verificationToken.email, email));
  }

  const data = { token, email, expires };
  await db.insert(verificationToken).values(data);

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
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.email, email));
  }

  const data = { token, email, expires };

  await db.insert(passwordResetToken).values(data);

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
      .delete(twoFactorToken)
      .where(eq(twoFactorToken.token, existingToken.token));
  }

  const data = { token, email, expires };

  await db.insert(twoFactorToken).values(data);

  return data;
};
