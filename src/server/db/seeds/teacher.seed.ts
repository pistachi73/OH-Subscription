import * as schema from "@/server/db/schema";
import type { DB } from "@/server/db/seed";
import teachers from "./data/teachers";

export default async function seed(db: DB) {
  await db.insert(schema.teacher).values(teachers);
}
