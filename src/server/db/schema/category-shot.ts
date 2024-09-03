import { relations } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { category } from "./category";
import { ohPgTable } from "./shared";
import { shot } from "./shot";

export const categoryShot = ohPgTable(
  "category_shot",
  {
    shotId: integer("shot_id")
      .notNull()
      .references(() => shot.id, {
        onDelete: "cascade",
      }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => category.id, {
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.categoryId, t.shotId],
    }),
  }),
);

export const categoryShotRelations = relations(categoryShot, ({ one }) => ({
  shot: one(shot, {
    fields: [categoryShot.shotId],
    references: [shot.id],
  }),
  category: one(category, {
    fields: [categoryShot.categoryId],
    references: [category.id],
  }),
}));
