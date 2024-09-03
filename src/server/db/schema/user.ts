import { relations } from "drizzle-orm";
import { boolean, index, text, timestamp } from "drizzle-orm/pg-core";
import { account } from "./account";
import { ohPgTable } from "./shared";

export const user = ohPgTable(
  "user",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    image: text("image"),
    password: text("password"),
    role: text("role", { enum: ["ADMIN", "USER"] }).default("USER"),
    isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    stripeSubscriptionEndsOn: timestamp("stripe_subscription_ends_on", {
      mode: "date",
    }),
  },
  (t) => ({
    stripeSubscriptionIdIndex: index().on(t.stripeSubscriptionId),
  }),
);

export const userRelations = relations(user, ({ one }) => ({
  account: one(account, {
    fields: [user.id],
    references: [account.userId],
  }),
}));
