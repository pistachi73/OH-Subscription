import { eq } from "drizzle-orm";

import type { DB } from "@/server/db";
import { account } from "@/server/db/schema";

export const getAccountByUserId = async ({
  db,
  userId,
}: {
  db: DB;
  userId: string;
}) => {
  try {
    return await db.query.account.findFirst({
      where: eq(account.userId, userId),
    });
  } catch {
    return null;
  }
};
