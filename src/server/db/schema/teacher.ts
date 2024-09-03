import { relations } from "drizzle-orm";
import { serial, text } from "drizzle-orm/pg-core";
import { ohPgTable } from "./shared";
import { teacherProgram } from "./teacher-program";

export const teacher = ohPgTable("teacher", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  image: text("image"),
});

export const teacherRelations = relations(teacher, ({ many }) => ({
  program: many(teacherProgram),
}));
