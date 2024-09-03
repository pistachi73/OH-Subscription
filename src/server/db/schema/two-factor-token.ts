import { text, timestamp, unique } from "drizzle-orm/pg-core";
import { ohPgTable } from "./shared";

export const twoFactorToken = ohPgTable(
  "two_factor_token",
  {
    token: text("token").notNull().primaryKey(),
    email: text("email").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => ({
    twoFactorTokensUnique: unique().on(t.email, t.token),
  }),
);
