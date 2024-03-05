import { eq } from "drizzle-orm";

import { type SharedLib } from "./lib.types";

import { twoFactorTokens } from "@/server/db/schema";

export const getTwoFactorTokenByToken = async ({
  db,
  token,
}: { token: string } & SharedLib) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.token, token),
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async ({
  db,
  email,
}: { email: string } & SharedLib) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};
