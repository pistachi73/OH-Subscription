import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";

import { env } from "@/env";
import { drizzle } from "drizzle-orm/neon-http";

const connection = neon(env.DATABASE_URL);
export const db = drizzle(connection, { schema });

export type DB = typeof db;
