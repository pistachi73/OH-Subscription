import { type AdapterAccount } from "@auth/core/adapters";
import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const mysqlTable = mysqlTableCreator(
//   (name) => `${env.DATABASE_PREFIX}_${name}`,
// );

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  image: text("image"),
  password: text("password"),
  role: text("role", { enum: ["ADMIN", "USER"] }).default("USER"),
  isTwoFactorEnabled: integer("isTwoFactorEnabled", {
    mode: "boolean",
  }).default(false),
});

export const accounts = sqliteTable(
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

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    token: text("token").notNull().primaryKey(),
    email: text("email").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    unique: unique().on(vt.email, vt.token),
  }),
);

export const passwordResetTokens = sqliteTable(
  "passwordResetToken",
  {
    token: text("token").notNull().primaryKey(),
    email: text("email").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (passwordResetToken) => ({
    passwordResetTokenUnique: unique("ss").on(
      passwordResetToken.email,
      passwordResetToken.token,
    ),
  }),
);

export const twoFactorTokens = sqliteTable(
  "twoFactorToken",
  {
    token: text("token").notNull().primaryKey(),
    email: text("email").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (twoFactorToken) => ({
    twoFactorTokensUnique: unique().on(
      twoFactorToken.email,
      twoFactorToken.token,
    ),
  }),
);

export const twoFactorConirmations = sqliteTable("twoFactorConfirmation", {
  id: text("id").notNull().primaryKey(),
  userId: text("user")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const programs = sqliteTable("programs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("role", {
    enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
  }).notNull(),
  totalChapters: integer("totalChapters").default(0).notNull(),
  duration: integer("duration").default(0).notNull(),
  published: integer("published", { mode: "boolean" }).default(false),
  teachers: text("teachers").default(""),
  categories: text("categories").default(""),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const videos = sqliteTable("video", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  transcript: text("transcript").default(""),
  url: text("url").default("").notNull(),
  duration: integer("duration").default(0).notNull(),
  categories: text("categories").default("").notNull(),
  thumbnail: text("thumbnail").default(""),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const programsVideos = sqliteTable(
  "programsVideos",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    programId: text("programId")
      .notNull()
      .references(() => programs.id, {
        onDelete: "cascade",
      }),
    videoId: text("videoId")
      .notNull()
      .references(() => videos.id, {
        onDelete: "cascade",
      }),
    chapterNumber: integer("chapterNumber").notNull(),
  },
  (t) => ({
    unq: unique().on(t.videoId, t.programId, t.chapterNumber),
  }),
);

export const teachers = sqliteTable("teachers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  image: text("image"),
});

// export type InsertUser = typeof users.$inferInsert;
export type SelectTeacher = typeof teachers.$inferSelect;
export type SelectVideo = typeof videos.$inferSelect;
export type SelectProgram = typeof programs.$inferSelect;
