import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  serial,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { comment } from "./comment";
import { program } from "./program";
import { ohPgTable } from "./shared";
import { shot } from "./shot";
import { user } from "./user";
import { video } from "./video";

export const like = ohPgTable(
  "like",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    commentId: integer("comment_id").references(() => comment.id, {
      onDelete: "cascade",
    }),
    programId: integer("program_id").references(() => program.id, {
      onDelete: "cascade",
    }),
    videoId: integer("video_id").references(() => video.id, {
      onDelete: "cascade",
    }),
    shotId: integer("shot_id").references(() => shot.id, {
      onDelete: "cascade",
    }),
    isLike: boolean("is_like").notNull().default(true),
  },
  (t) => ({
    videoIdIndex: index().on(t.videoId),
    programIdIndex: index().on(t.programId),
    shotIdIndex: index().on(t.shotId),
    commentIdIndex: index().on(t.commentId),
    programIdUnique: unique().on(t.userId, t.programId),
    shotIdUnique: unique().on(t.userId, t.shotId),
    commentIdUnique: unique().on(t.userId, t.commentId),
    videoIdUnique: unique().on(t.userId, t.videoId),
  }),
);

export const likeRelations = relations(like, ({ one }) => ({
  user: one(user, {
    fields: [like.userId],
    references: [user.id],
  }),
  comment: one(comment, {
    fields: [like.commentId],
    references: [comment.id],
  }),
  program: one(program, {
    fields: [like.programId],
    references: [program.id],
  }),
  video: one(video, {
    fields: [like.videoId],
    references: [video.id],
  }),
  shot: one(shot, {
    fields: [like.shotId],
    references: [shot.id],
  }),
}));
