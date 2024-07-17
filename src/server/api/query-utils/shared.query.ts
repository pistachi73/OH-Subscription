import type { AnyColumn } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

export const withLimit = <T extends PgSelect>(qb: T, limit: number) => {
  return qb.limit(limit);
};

export const withOffset = <T extends PgSelect>(qb: T, offset: number) => {
  return qb.offset(offset);
};

export const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

export const decrement = (column: AnyColumn, value = 1, min = 0) => {
  return sql`case when ${column} > ${min} then (${column} - ${value}) else ${min} end`;
};
