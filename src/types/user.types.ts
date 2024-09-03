import type { user } from "@/server/db/schema";

export type User = typeof user.$inferSelect;

export type UserRole = User["role"];
