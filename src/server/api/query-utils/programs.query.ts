import { eq, getTableColumns, inArray, sql } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

import {
  categories,
  categoriesOnPrograms,
  programs,
  teachers,
  teachersOnPrograms,
  videosOnPrograms,
} from "@/server/db/schema";

export const programsWithCategories = <T extends PgSelect>(qb: T) => {
  return qb
    .leftJoin(
      categoriesOnPrograms,
      eq(programs.id, categoriesOnPrograms.programId),
    )
    .leftJoin(categories, eq(categories.id, categoriesOnPrograms.categoryId));
};

export const programsWithTeachers = <T extends PgSelect>(qb: T) => {
  return qb
    .leftJoin(teachersOnPrograms, eq(programs.id, teachersOnPrograms.programId))
    .leftJoin(teachers, eq(teachers.id, teachersOnPrograms.teacherId));
};

export const filterProgramsByTeacher = <T extends PgSelect>(
  qb: T,
  teacherIds: number | number[],
) => {
  if (Array.isArray(teacherIds)) {
    return qb.where(inArray(teachers.id, teacherIds));
  }

  return qb.where(eq(teachers.id, teacherIds));
};

export const filterProgramsByCategoryId = <T extends PgSelect>(
  qb: T,
  categoryIds: number | number[],
) => {
  if (Array.isArray(categoryIds)) {
    return qb.where(inArray(categories.id, categoryIds));
  }

  return qb.where(eq(categories.id, categoryIds));
};

export const filterProgramsByCategoryName = <T extends PgSelect>(
  qb: T,
  categoryNames: string | string[],
) => {
  if (Array.isArray(categoryNames)) {
    const lowerCategoryNames = categoryNames.map((name) => name.toLowerCase());
    return qb.where(
      inArray(sql`lower(${categories.name})`, lowerCategoryNames),
    );
  }

  return qb.where(
    eq(sql`lower(${categories.name})`, sql`lower(${categoryNames})`),
  );
};
