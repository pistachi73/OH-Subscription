import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

import * as schema from "./schema";

const client = neon(process.env.DATABASE_URL as string);
const db = drizzle(client, { schema });

const main = async () => {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
