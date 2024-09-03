import { relations } from "drizzle-orm";
import { index, integer, serial, text, timestamp } from "drizzle-orm/pg-core";
import { program } from "./program";
import { ohPgTable } from "./shared";
import { shot } from "./shot";
import { user } from "./user";
import { video } from "./video";

export const comment = ohPgTable(
  "comment",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    programId: integer("program_id").references(() => program.id, {
      onDelete: "cascade",
    }),
    videoId: integer("video_id").references(() => video.id, {
      onDelete: "cascade",
    }),
    shotId: integer("shot_id").references(() => shot.id, {
      onDelete: "cascade",
    }),
    parentCommentId: integer("parent_comment_id"),
    content: text("content").notNull(),
    likes: integer("likes").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    videoIdIndex: index().on(t.videoId),
    programIdIndex: index().on(t.programId),
    shotIdIndex: index().on(t.shotId),
    parentCommentIdIndex: index().on(t.parentCommentId),
  }),
);

export const commentRelations = relations(comment, ({ one, many }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  program: one(program, {
    fields: [comment.programId],
    references: [program.id],
  }),
  video: one(video, {
    fields: [comment.videoId],
    references: [video.id],
  }),
  shot: one(shot, {
    fields: [comment.shotId],
    references: [shot.id],
  }),

  // PARENT COMMENT RELATION
  parentComment: one(comment, {
    fields: [comment.parentCommentId],
    references: [comment.id],
    relationName: "parent_comments",
  }),
  childComment: many(comment, {
    relationName: "parent_comments",
  }),
}));
