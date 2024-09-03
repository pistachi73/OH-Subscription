import type { SQL } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, serial, text } from "drizzle-orm/pg-core";
import { categoryProgram } from "./category-program";
import { ohPgTable, slugify } from "./shared";

export const category = ohPgTable(
  "category",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug")
      .generatedAlwaysAs((): SQL => slugify(category.name))
      .notNull(),
  },
  (table) => ({
    slugIdx: index().on(table.slug),
  }),
);

export const categoryRelations = relations(category, ({ many }) => ({
  programs: many(categoryProgram),
}));
