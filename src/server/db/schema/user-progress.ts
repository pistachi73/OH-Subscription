import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  primaryKey,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { program } from "./program";
import { ohPgTable } from "./shared";
import { user } from "./user";
import { video } from "./video";

export const userProgress = ohPgTable(
  "user_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
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
    lastWatchedAt: timestamp("last_watched_at", { mode: "date" }).defaultNow(),
    completed: boolean("completed").default(false),
    watchedDuration: real("watched_duration").default(0),
    progress: integer("progress").default(0),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.userId, t.videoId, t.programId],
    }),
    programIdIndex: index().on(t.programId),
    videoIdIndex: index().on(t.videoId),
    userIdIndex: index().on(t.userId),
  }),
);

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(user, {
    fields: [userProgress.userId],
    references: [user.id],
  }),
  program: one(program, {
    fields: [userProgress.programId],
    references: [program.id],
  }),
  video: one(video, {
    fields: [userProgress.videoId],
    references: [video.id],
  }),
}));
