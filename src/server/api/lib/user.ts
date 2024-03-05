import { eq } from "drizzle-orm";

import { type DB } from "@/server/db";
import { users } from "@/server/db/schema";

export const getUserByEmail = async ({
  db,
  email,
}: {
  db: DB;
  email: string;
}) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user;
  } catch {
    return null;
  }
};
export const getUserById = async ({ db, id }: { db: DB; id: string }) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return user;
  } catch {
    return null;
  }
};
