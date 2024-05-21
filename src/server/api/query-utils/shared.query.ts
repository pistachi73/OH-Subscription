import { type PgSelect } from "drizzle-orm/pg-core";

export const withLimit = <T extends PgSelect>(qb: T, limit: number) => {
  return qb.limit(limit);
};

export const withOffset = <T extends PgSelect>(qb: T, offset: number) => {
  return qb.offset(offset);
};
