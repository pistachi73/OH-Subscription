import "dotenv/config";
import { getTableName, sql } from "drizzle-orm";

import * as schema from "@/server/db/schema/index";
import * as seeds from "@/server/db/seeds";

import { env } from "@/env";
import { neon } from "@neondatabase/serverless";
import type { Table } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const connection = neon(env.DATABASE_URL);
const db = drizzle(connection, { schema });
export type DB = typeof db;

async function resetTable(db: DB, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`),
  );
}

for (const table of [
  schema.userProgress,
  schema.user,
  schema.video,
  schema.videoProgram,
  schema.shot,
  schema.program,
  schema.comment,
  schema.like,
  schema.twoFactorToken,
  schema.twoFactorConirmation,
  schema.verificationToken,
  schema.passwordResetToken,
  schema.category,
  schema.categoryShot,
  schema.categoryProgram,
  schema.teacher,
  schema.teacherProgram,
]) {
  await resetTable(db, table);
}

async function main() {
  try {
    console.log("Seeding...");
    await seeds.category(db);
    await seeds.teacher(db);
    await seeds.video(db);
    await seeds.program(db);
    await seeds.shot(db);
    await seeds.user(db);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main();
