import { category } from "@/server/db/schema";
import type { DB } from "@/server/db/seed";
import categories from "./data/categories";

export default async function seed(db: DB) {
  await db.insert(category).values(categories);
}
