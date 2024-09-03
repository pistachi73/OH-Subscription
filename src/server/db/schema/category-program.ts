import { relations } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { category } from "./category";
import { program } from "./program";
import { ohPgTable } from "./shared";

export const categoryProgram = ohPgTable(
  "category_program",
  {
    programId: integer("program_id")
      .notNull()
      .references(() => program.id, {
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
      columns: [t.categoryId, t.programId],
    }),
  }),
);

export const categoryProgramRelations = relations(
  categoryProgram,
  ({ one }) => ({
    program: one(program, {
      fields: [categoryProgram.programId],
      references: [program.id],
    }),
    category: one(category, {
      fields: [categoryProgram.categoryId],
      references: [category.id],
    }),
  }),
);
