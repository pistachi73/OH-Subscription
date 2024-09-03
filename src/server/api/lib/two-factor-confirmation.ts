import { eq } from "drizzle-orm";

import type { SharedLib } from "./lib.types";

import { twoFactorConirmation } from "@/server/db/schema";
export const getTwoFactorConirmationByUserId = async ({
  userId,
  db,
}: { userId: string } & SharedLib) => {
  try {
    return await db.query.twoFactorConirmation.findFirst({
      where: eq(twoFactorConirmation.userId, userId),
    });
  } catch {
    return null;
  }
};
