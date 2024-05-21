import type * as schema from "./schema";
import { type programs, type teachers } from "./schema";

export type Program = typeof programs.$inferSelect;
export type Category = typeof schema.categories.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;

export type ProgramLevel = Program["level"];
