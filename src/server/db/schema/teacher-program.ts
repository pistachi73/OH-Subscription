import { relations } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { program } from "./program";
import { ohPgTable } from "./shared";
import { teacher } from "./teacher";

export const teacherProgram = ohPgTable(
  "teacher_program",
  {
    programId: integer("program_id")
      .notNull()
      .references(() => program.id, {
        onDelete: "cascade",
      }),
    teacherId: integer("teacherId")
      .notNull()
      .references(() => teacher.id, {
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.teacherId, t.programId],
    }),
  }),
);

export const teacherProgramRelations = relations(teacherProgram, ({ one }) => ({
  program: one(program, {
    fields: [teacherProgram.programId],
    references: [program.id],
  }),
  teacher: one(teacher, {
    fields: [teacherProgram.teacherId],
    references: [teacher.id],
  }),
}));
