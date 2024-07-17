import { and, eq, inArray, sql } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

import type { DB } from "@/server/db";
import {
  categories,
  categoriesOnPrograms,
  likes,
  programs,
  teachers,
  teachersOnPrograms,
  videos,
  videosOnPrograms,
} from "@/server/db/schema";
import type { Category, Teacher, Video } from "@/server/db/schema.types";

export const programCategoriesSelect = sql<Category[] | null>`json_agg(DISTINCT
  jsonb_build_object(
    'id', ${categories.id},
    'name', ${categories.name})
  ) FILTER (WHERE ${categories.id} IS NOT NULL)`;

export const programTeachersSelect = sql<Omit<Teacher, "bio">[] | null>`json_agg(DISTINCT
  jsonb_build_object(
    'id', ${teachers.id},
    'image', ${teachers.image},
    'name', ${teachers.name})
  ) FILTER (WHERE ${teachers.id} IS NOT NULL)`;

export const programChaptersSelect = sql<
  | (Pick<
      Video,
      "updatedAt" | "slug" | "duration" | "description" | "thumbnail" | "title"
    > & { chapterNumber: number })[]
  | null
>`json_agg(DISTINCT
jsonb_build_object(
  'updatedAt', ${videos.updatedAt},
  'slug', ${videos.slug},
  'duration', ${videos.duration},
  'description', ${videos.description},
  'thumbnail', ${videos.thumbnail},
  'title', ${videos.title},
  'chapterNumber', ${videosOnPrograms.chapterNumber})
) FILTER (WHERE ${videos.id} IS NOT NULL)`;

export const isProgramLikedByUserSubquery = ({
  db,
  userId,
}: { db: DB; userId?: string }) =>
  sql<boolean>`exists(${db
    .select({ n: sql`1` })
    .from(likes)
    .where(
      and(eq(likes.programId, programs.id), eq(likes.userId, userId ?? "")),
    )})`.as("isLikedByUser");

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
