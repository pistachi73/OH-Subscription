import { type AdapterAccount } from "@auth/core/adapters";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const mysqlTable = mysqlTableCreator(
//   (name) => `${env.DATABASE_PREFIX}_${name}`,
// );

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  image: text("image"),
  password: text("password"),
  role: text("role", { enum: ["ADMIN", "USER"] }).default("USER"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);
export const verificationTokens = pgTable(
  "verificationToken",
  {
    token: text("token").notNull().primaryKey(),
    email: text("email").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    unique: unique().on(vt.email, vt.token),
  }),
);

export const passwordResetTokens = pgTable(
  "passwordResetToken",
  {
    token: text("token").notNull().primaryKey(),
    email: text("email").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (passwordResetToken) => ({
    passwordResetTokenUnique: unique("ss").on(
      passwordResetToken.email,
      passwordResetToken.token,
    ),
  }),
);

export const twoFactorTokens = pgTable(
  "twoFactorToken",
  {
    token: text("token").notNull().primaryKey(),
    email: text("email").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (twoFactorToken) => ({
    twoFactorTokensUnique: unique().on(
      twoFactorToken.email,
      twoFactorToken.token,
    ),
  }),
);

export const twoFactorConirmations = pgTable("twoFactorConfirmation", {
  id: text("id").notNull().primaryKey(),
  userId: text("user")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("role", {
    enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
  }).notNull(),
  totalChapters: integer("totalChapters").default(0).notNull(),
  duration: integer("duration").default(0).notNull(),
  published: boolean("published").default(false),
  teachers: text("teachers").default(""),
  categories: text("categories").default(""),
  thumbnail: text("thumbnail"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const videos = pgTable("video", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  duration: integer("duration").notNull(),
  thumbnail: text("thumbnail"),
  categories: text("categories"),
  transcript: text("transcript"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const videosToPrograms = pgTable(
  "videosToPrograms",
  {
    programId: integer("programId")
      .notNull()
      .references(() => programs.id, {
        onDelete: "cascade",
      }),
    videoId: integer("videoId")
      .notNull()
      .references(() => videos.id, {
        onDelete: "cascade",
      }),
    chapterNumber: integer("chapterNumber").notNull(),
  },
  (t) => ({
    unq: unique().on(t.videoId, t.programId, t.chapterNumber),
    pk: primaryKey({
      columns: [t.videoId, t.programId],
    }),
  }),
);

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  image: text("image"),
});

// export type InsertUser = typeof users.$inferInsert;
export type SelectTeacher = typeof teachers.$inferSelect;
export type SelectVideo = typeof videos.$inferSelect;
export type SelectProgram = typeof programs.$inferSelect;
