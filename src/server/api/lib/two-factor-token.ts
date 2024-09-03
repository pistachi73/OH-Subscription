import { eq } from "drizzle-orm";

import type { SharedLib } from "./lib.types";

import { twoFactorToken } from "@/server/db/schema";

export const getTwoFactorTokenByToken = async ({
  db,
  token,
}: { token: string } & SharedLib) => {
  try {
    return await db.query.twoFactorToken.findFirst({
      where: eq(twoFactorToken.token, token),
    });
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async ({
  db,
  email,
}: { email: string } & SharedLib) => {
  try {
    return await db.query.twoFactorToken.findFirst({
      where: eq(twoFactorToken.email, email),
    });
  } catch {
    return null;
  }
};
