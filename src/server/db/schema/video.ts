import type { SQL } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, integer, serial, text, timestamp } from "drizzle-orm/pg-core";
import { ohPgTable, slugify } from "./shared";
import { videoProgram } from "./video-program";

export const video = ohPgTable(
  "video",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug")
      .generatedAlwaysAs((): SQL => slugify(video.title))
      .notNull(),
    description: text("description").notNull(),
    url: text("url").notNull(),
    duration: integer("duration").notNull(),
    thumbnail: text("thumbnail"),
    transcript: text("transcript"),
    likes: integer("likes").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      videoSlugIdx: index().on(table.slug),
    };
  },
);

export const videoRelations = relations(video, ({ many }) => ({
  program: many(videoProgram),
}));
