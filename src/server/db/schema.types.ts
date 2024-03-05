import { type InferSelectModel } from "drizzle-orm";

import { type users } from "./schema";

export type UserRole = InferSelectModel<typeof users>["role"];
