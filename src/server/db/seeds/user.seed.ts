import * as schema from "@/server/db/schema";
import type { DB } from "@/server/db/seed";
import bcrypt from "bcryptjs";
import users from "./data/users";

export default async function seed(db: DB) {
  await Promise.all(
    users.map(async (user) => {
      const { password, ...rest } = user;
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.insert(schema.user).values({
        ...rest,
        password: hashedPassword,
      });
    }),
  );
}
