import { text, timestamp, unique } from "drizzle-orm/pg-core";
import { ohPgTable } from "./shared";

export const verificationToken = ohPgTable(
  "verification_token",
  {
    token: text("token").notNull().primaryKey(),
    email: text("email").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    unique: unique().on(vt.email, vt.token),
  }),
);
