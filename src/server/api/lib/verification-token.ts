import { eq } from "drizzle-orm";

import { type SharedLib } from "./lib.types";

import { verificationTokens } from "@/server/db/schema";

export const getVerificationTokenByToken = async ({
  db,
  token,
}: { token: string } & SharedLib) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async ({
  db,
  email,
}: { email: string } & SharedLib) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.email, email),
    });

    return verificationToken;
  } catch {
    return null;
  }
};
