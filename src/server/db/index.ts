import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

import { env } from "@/env";

export const client = neon(env.DATABASE_URL);

export const db = drizzle(client, { schema });

export type DB = typeof db;
