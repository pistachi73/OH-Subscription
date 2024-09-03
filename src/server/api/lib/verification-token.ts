import { eq } from "drizzle-orm";

import { verificationToken } from "@/server/db/schema";
import type { SharedLib } from "./lib.types";

export const getVerificationTokenByToken = async ({
  db,
  token,
}: { token: string } & SharedLib) => {
  try {
    return await db.query.verificationToken.findFirst({
      where: eq(verificationToken.token, token),
    });
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async ({
  db,
  email,
}: { email: string } & SharedLib) => {
  try {
    return await db.query.verificationToken.findFirst({
      where: eq(verificationToken.email, email),
    });
  } catch {
    return null;
  }
};
