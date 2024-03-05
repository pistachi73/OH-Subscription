import { eq } from "drizzle-orm";

import { type DB } from "@/server/db";
import { accounts } from "@/server/db/schema";

export const getAccountByUserId = async ({
  db,
  userId,
}: {
  db: DB;
  userId: string;
}) => {
  try {
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.userId, userId),
    });

    return account;
  } catch {
    return null;
  }
};
