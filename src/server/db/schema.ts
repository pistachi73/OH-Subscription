import { type AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  boolean,
  datetime,
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

import { env } from "@/env";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator(
  (name) => `${env.DATABASE_PREFIX}_${name}`,
);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).defaultNow(),

  image: varchar("image", { length: 255 }),
  password: varchar("password", { length: 255 }),
  role: mysqlEnum("role", ["ADMIN", "USER"]).default("USER"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  twoFactorConirmations: many(twoFactorConirmations),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),

    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    token: varchar("token", { length: 255 }).notNull().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    expires: datetime("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    unique: unique().on(verificationToken.email, verificationToken.token),
  }),
);

export const passwordResetTokens = mysqlTable(
  "passwordResetToken",
  {
    token: varchar("token", { length: 255 }).notNull().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    expires: datetime("expires", { mode: "date" }).notNull(),
  },
  (passwordResetToken) => ({
    passwordResetTokenUnique: unique("ss").on(
      passwordResetToken.email,
      passwordResetToken.token,
    ),
  }),
);

export const twoFactorTokens = mysqlTable(
  "twoFactorToken",
  {
    token: varchar("token", { length: 255 }).notNull().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    expires: datetime("expires", { mode: "date" }).notNull(),
  },
  (twoFactorToken) => ({
    twoFactorTokensUnique: unique().on(
      twoFactorToken.email,
      twoFactorToken.token,
    ),
  }),
);
export const twoFactorConirmations = mysqlTable("twoFactorConfirmation", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const twoFactorConfirmationsRelations = relations(
  twoFactorConirmations,
  ({ one }) => ({
    user: one(users, {
      fields: [twoFactorConirmations.userId],
      references: [users.id],
    }),
  }),
);
