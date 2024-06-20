import { eq, inArray, sql } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

import {
  categories,
  categoriesOnPrograms,
  programs,
  teachers,
  teachersOnPrograms,
  videos,
  videosOnPrograms,
} from "@/server/db/schema";
import type { Category, Teacher } from "@/server/db/schema.types";

export const programCategoriesSelect = {
  categories: sql<Category[] | null>`
  nullif
    (json_agg(DISTINCT
      nullif(
        jsonb_strip_nulls(
          jsonb_build_object(
            'id', ${categories.id},
            'name', ${categories.name}
          )
        )::jsonb,
      '{}'::jsonb)
    )::jsonb,
  '[null]'::jsonb)`,
};

export const programTeachersSelect = {
  teachers: sql<Omit<Teacher, "bio">[] | null>`
  nullif
    (json_agg(DISTINCT
      nullif(
        jsonb_strip_nulls(
          jsonb_build_object(
            'id', ${teachers.id},
            'image', ${teachers.image},
            'name', ${teachers.name}
          )
        )::jsonb,
      '{}'::jsonb)
    )::jsonb,
  '[null]'::jsonb)`,
};

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

export const programsWithChapters = <T extends PgSelect>(qb: T) => {
  return qb
    .leftJoin(videosOnPrograms, eq(programs.id, videosOnPrograms.programId))
    .leftJoin(videos, eq(videos.id, videosOnPrograms.videoId));
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
