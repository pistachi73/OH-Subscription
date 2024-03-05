import { eq } from "drizzle-orm";

import { type SharedLib } from "./lib.types";

import { twoFactorConirmations } from "@/server/db/schema";
export const getTwoFactorConirmationByUserId = async ({
  userId,
  db,
}: { userId: string } & SharedLib) => {
  try {
    return await db.query.twoFactorConirmations.findFirst({
      where: eq(twoFactorConirmations.userId, userId),
    });
  } catch {
    return null;
  }
};
