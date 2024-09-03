import * as schema from "@/server/db/schema";
import type { DB } from "@/server/db/seed";
import videos from "./data/videos";

export default async function seed(db: DB) {
  await db.insert(schema.video).values(videos);
}
