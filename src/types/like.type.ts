import type { like } from "@/server/db/schema";
import { z } from "zod";
import { extendBaseSchemasWithSourceId } from "./shared.types";

export type Like = typeof like.$inferSelect;

export const LikeBySourceIdSchema = extendBaseSchemasWithSourceId(z.object({}));
