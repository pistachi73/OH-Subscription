import { env } from "@/env";
import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

import type { Column } from "drizzle-orm";

export const ohPgTable = pgTableCreator(
  (name) => `${env.DATABASE_PREFIX}_${name}`,
);

export const slugify = (column: Column) => sql`regexp_replace(
    regexp_replace(
      lower(${column}), -- Lowercase and remove accents in one step
      '[^a-z0-9\\-_]+', '-', 'gi' -- Replace non-alphanumeric characters with hyphens
    ),
    '(^-+|-+$)', '', 'g' -- Remove leading and trailing hyphens
  )`;