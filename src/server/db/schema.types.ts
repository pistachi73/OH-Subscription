import type { RouterOutputs } from "@/trpc/shared";
import type { categories, programs, teachers, users, videos } from "./schema";

export type Program = typeof programs.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type User = typeof users.$inferSelect;

export type ProgramLevel = Program["level"];
export type UserRole = User["role"];

// TYPES FROM QUERYS
export type ProgramSpotlight = RouterOutputs["program"]["getBySlug"];
