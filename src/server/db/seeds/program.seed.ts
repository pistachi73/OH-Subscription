import { generateEmbedding } from "@/server/api/lib/openai";
import * as schema from "@/server/db/schema";
import type { DB } from "@/server/db/seed";
import { eq } from "drizzle-orm";
import { default as programs } from "./data/programs";

async function getCategoryId(db: DB, categoryName: string) {
  const category = await db.query.category.findFirst({
    where: eq(schema.category.name, categoryName),
  });
  if (!category) {
    throw new Error(`Unknown category: ${categoryName}`);
  }
  return category.id;
}

async function getTeacherId(db: DB, teacherName: string) {
  const teacher = await db.query.teacher.findFirst({
    where: eq(schema.teacher.name, teacherName),
  });
  if (!teacher) {
    throw new Error(`Unknown teacher: ${teacherName}`);
  }
  return teacher.id;
}

async function getVideoIdAndSlug(db: DB, videoTitle: string) {
  const video = await db.query.video.findFirst({
    where: eq(schema.video.title, videoTitle),
  });
  if (!video) {
    throw new Error(`Unknown video: ${videoTitle}`);
  }
  return [video.id, video.slug] as const;
}

export default async function seed(db: DB) {
  await Promise.all(
    programs.map(async ({ chapters, teachers, categories, ...program }) => {
      const teachersEmbedding = teachers?.map((name) => name).join(",");
      const categoriesEmbedding = categories?.map((name) => name).join(",");
      let embeddingInput = `${program.title}|${program.description}`;

      if (teachersEmbedding) embeddingInput += `|${teachersEmbedding}`;
      if (categoriesEmbedding) embeddingInput += `|${categoriesEmbedding}`;

      const embedding = await generateEmbedding(embeddingInput);

      const [insertedProgram] = await db
        .insert(schema.program)
        .values({ ...program, embedding })
        .returning();

      if (!insertedProgram) {
        throw new Error("Program not inserted");
      }

      await Promise.all(
        chapters.map(async ({ chapterNumber, title, isFree }) => {
          const [videoId, videoSlug] = await getVideoIdAndSlug(db, title);

          await db.insert(schema.videoProgram).values({
            programId: insertedProgram.id,
            videoId,
            videoSlug,
            programSlug: insertedProgram.slug,
            chapterNumber,
            isFree,
          });
        }),
      );

      await Promise.all(
        teachers.map(async (teacherName) => {
          const teacherId = await getTeacherId(db, teacherName);
          await db.insert(schema.teacherProgram).values({
            programId: insertedProgram.id,
            teacherId,
          });
        }),
      );

      await Promise.all(
        categories.map(async (categoryName) => {
          const categoryId = await getCategoryId(db, categoryName);
          await db.insert(schema.categoryProgram).values({
            programId: insertedProgram.id,
            categoryId,
          });
        }),
      );
    }),
  );
}
