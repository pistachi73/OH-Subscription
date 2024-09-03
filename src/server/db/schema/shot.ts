import type { SQL } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";
import { categoryShot } from "./category-shot";
import { ohPgTable, slugify } from "./shared";

export const shot = ohPgTable(
  "shot",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug")
      .generatedAlwaysAs((): SQL => slugify(shot.title))
      .notNull(),
    description: text("description").notNull(),
    transcript: text("transcript"),
    playbackId: text("playbackId").notNull(),
    likes: integer("likes").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date()),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (t) => {
    return {
      shotEmbeddingIndex: index().using(
        "hnsw",
        t.embedding.op("vector_cosine_ops"),
      ),
    };
  },
);

export const shotRelations = relations(shot, ({ many }) => ({
  categories: many(categoryShot),
}));
