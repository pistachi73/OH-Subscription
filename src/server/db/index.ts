import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "./schema";

import { env } from "@/env";

const client = new Client({
  url: env.DATABASE_URL,
});

export const db = drizzle(client, { schema });

export type DB = typeof db;
