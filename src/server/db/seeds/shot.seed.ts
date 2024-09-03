import { generateEmbedding } from "@/server/api/lib/openai";
import * as schema from "@/server/db/schema";
import type { DB } from "@/server/db/seed";
import { eq } from "drizzle-orm";
import { default as shots } from "./data/shots";

async function getCategoryId(db: DB, categoryName: string) {
  const category = await db.query.category.findFirst({
    where: eq(schema.category.name, categoryName),
  });
  if (!category) {
    throw new Error(`Unknown category: ${categoryName}`);
  }
  return category.id;
}

export default async function seed(db: DB) {
  await Promise.all(
    shots.map(async ({ categories, ...shot }) => {
      const embedding = await generateEmbedding(shot.title);

      const [insertedShot] = await db
        .insert(schema.shot)
        .values({ ...shot, embedding })
        .returning();

      if (!insertedShot) {
        throw new Error("Shot not inserted");
      }

      await Promise.all(
        categories.map(async (categoryName) => {
          const categoryId = await getCategoryId(db, categoryName);
          await db.insert(schema.categoryShot).values({
            shotId: insertedShot.id,
            categoryId,
          });
        }),
      );
    }),
  );
}
