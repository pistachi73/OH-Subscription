import { type AdapterAccount } from "@auth/core/adapters";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { tsvector } from "./tsvector";

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

// ----------------- Verification Tokens -----------------
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

// ----------------- Password Reset Tokens -----------------
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

// ----------------- Two Factor Tokens -----------------
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

// ----------------- Two Factor Confirmations -----------------
export const twoFactorConirmations = pgTable("twoFactorConfirmation", {
  id: text("id").notNull().primaryKey(),
  userId: text("user")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// ----------------- Programs -----------------
export const programs = pgTable(
  "programs",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    level: text("level", {
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    }).notNull(),
    totalChapters: integer("totalChapters").default(0).notNull(),
    duration: integer("duration").default(0).notNull(),
    published: boolean("published").default(false),
    thumbnail: text("thumbnail"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date()),
    document: tsvector("document", {
      sources: ["title", "description"],
    }),
  },
  (table) => {
    return {
      programSlugIdx: index().on(table.slug),
      documentIdx: index()
        .on(table.document)
        .using(sql`gin`),
    };
  },
);

export const programRelations = relations(programs, ({ many }) => ({
  chapters: many(videosOnPrograms),
  teachers: many(teachersOnPrograms),
  categories: many(categoriesOnPrograms),
}));

// ----------------- Videos -----------------
export const videos = pgTable(
  "video",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
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
  },
  (table) => {
    return {
      videoSlugIdx: index().on(table.slug),
    };
  },
);

export const videoRelations = relations(videos, ({ many }) => ({
  programs: many(videosOnPrograms),
}));

// ----------------- Videos on Programs -----------------
export const videosOnPrograms = pgTable(
  "videos_programs",
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

export const videosOnProgramsRelations = relations(
  videosOnPrograms,
  ({ one }) => ({
    program: one(programs, {
      fields: [videosOnPrograms.programId],
      references: [programs.id],
    }),
    video: one(videos, {
      fields: [videosOnPrograms.videoId],
      references: [videos.id],
    }),
  }),
);

// ----------------- Teachers -----------------
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  image: text("image"),
});

export const teachersRelations = relations(teachers, ({ many }) => ({
  programs: many(teachersOnPrograms),
}));

// ----------------- Teachers on Programs -----------------
export const teachersOnPrograms = pgTable(
  "teachers_programs",
  {
    programId: integer("programId")
      .notNull()
      .references(() => programs.id, {
        onDelete: "cascade",
      }),
    teacherId: integer("teacherId")
      .notNull()
      .references(() => teachers.id, {
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.teacherId, t.programId],
    }),
  }),
);

export const teachersOnProgramsRelations = relations(
  teachersOnPrograms,
  ({ one }) => ({
    program: one(programs, {
      fields: [teachersOnPrograms.programId],
      references: [programs.id],
    }),
    teacher: one(teachers, {
      fields: [teachersOnPrograms.teacherId],
      references: [teachers.id],
    }),
  }),
);

// ----------------- Categories -----------------
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  programs: many(categoriesOnPrograms),
}));

// ----------------- Category Programs -----------------
export const categoriesOnPrograms = pgTable(
  "categories_programs",
  {
    programId: integer("programId")
      .notNull()
      .references(() => programs.id, {
        onDelete: "cascade",
      }),
    categoryId: integer("categoryId")
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.categoryId, t.programId],
    }),
  }),
);

export const categoriesOnProgramsRelations = relations(
  categoriesOnPrograms,
  ({ one }) => ({
    program: one(programs, {
      fields: [categoriesOnPrograms.programId],
      references: [programs.id],
    }),
    category: one(categories, {
      fields: [categoriesOnPrograms.categoryId],
      references: [categories.id],
    }),
  }),
);

// export type InsertUser = typeof users.$inferInsert;
export type SelectTeacher = typeof teachers.$inferSelect;
export type SelectVideo = typeof videos.$inferSelect;
export type SelectProgram = typeof programs.$inferSelect;
