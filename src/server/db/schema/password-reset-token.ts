import { text, timestamp, unique } from "drizzle-orm/pg-core";
import { ohPgTable } from "./shared";

export const passwordResetToken = ohPgTable(
  "password_reset_token",
  {
    token: text("token").notNull().primaryKey(),
    email: text("email").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => ({
    passwordResetTokenUnique: unique().on(t.email, t.token),
  }),
);
