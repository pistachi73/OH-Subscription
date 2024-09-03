import type { SQL } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";
import { categoryProgram } from "./category-program";
import { ohPgTable, slugify } from "./shared";
import { teacherProgram } from "./teacher-program";
import { videoProgram } from "./video-program";

export const program = ohPgTable(
  "program",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug")
      .generatedAlwaysAs((): SQL => slugify(program.title))
      .notNull(),
    description: text("description").notNull(),
    level: text("level", {
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    }).notNull(),
    totalChapters: integer("total_chapters").default(0).notNull(),
    duration: integer("duration").default(0).notNull(),
    published: boolean("published").default(false),
    thumbnail: text("thumbnail"),
    likes: integer("likes").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date()),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (t) => {
    return {
      programSlugIdx: index().on(t.slug),
      embeddingIndex: index().using(
        "hnsw",
        t.embedding.op("vector_cosine_ops"),
      ),
    };
  },
);

export const programRelations = relations(program, ({ many }) => ({
  chapters: many(videoProgram),
  teachers: many(teacherProgram),
  categories: many(categoryProgram),
}));
