import { text } from "drizzle-orm/pg-core";
import { ohPgTable } from "./shared";
import { user } from "./user";

export const twoFactorConirmation = ohPgTable("two_factor_confirmation", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
