import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import "dotenv/config";

import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

const db = drizzle(client, { schema });

const main = async () => {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
