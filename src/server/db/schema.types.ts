import type { categories, programs, teachers, users } from "./schema";

export type Program = typeof programs.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type User = typeof users.$inferSelect;

export type ProgramLevel = Program["level"];
export type UserRole = User["role"];
