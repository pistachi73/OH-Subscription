import { eq } from "drizzle-orm";

import type { DB } from "@/server/db";
import * as schema from "@/server/db/schema";

export const getUserByEmail = async ({
  db,
  email,
}: {
  db: DB;
  email: string;
}) => {
  try {
    const user = await db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });

    return user;
  } catch {
    return null;
  }
};
export const getUserById = async ({ db, id }: { db: DB; id: string }) => {
  try {
    const user = await db.query.user.findFirst({
      where: eq(schema.user.id, id),
    });

    return user;
  } catch {
    return null;
  }
};
