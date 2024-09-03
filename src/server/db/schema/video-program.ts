import { relations } from "drizzle-orm";
import { boolean, integer, primaryKey, unique } from "drizzle-orm/pg-core";
import { program } from "./program";
import { ohPgTable } from "./shared";
import { video } from "./video";

export const videoProgram = ohPgTable(
  "video_program",
  {
    programId: integer("program_id")
      .notNull()
      .references(() => program.id, {
        onDelete: "cascade",
      }),
    videoId: integer("video_id")
      .notNull()
      .references(() => video.id, {
        onDelete: "cascade",
      }),
    chapterNumber: integer("chapter_number").notNull(),
    isFree: boolean("is_free").default(false),
  },
  (t) => ({
    unq: unique().on(t.videoId, t.programId, t.chapterNumber),
    pk: primaryKey({
      columns: [t.videoId, t.programId],
    }),
  }),
);

export const videoProgramRelations = relations(videoProgram, ({ one }) => ({
  program: one(program, {
    fields: [videoProgram.programId],
    references: [program.id],
  }),
  video: one(video, {
    fields: [videoProgram.videoId],
    references: [video.id],
  }),
}));
