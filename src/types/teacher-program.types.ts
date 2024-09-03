import type { teacherProgram } from "@/server/db/schema";
import { z } from "zod";

export type TeacherProgram = typeof teacherProgram.$inferSelect;

export const TeacherProgramInsertSchema = z.object({
  programId: z.number(),
  teacherId: z.number(),
});
