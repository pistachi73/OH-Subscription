import { Pool, neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "./schema";

import { env } from "@/env";

export const client = neon(env.DATABASE_URL);
const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export type DB = typeof db;
