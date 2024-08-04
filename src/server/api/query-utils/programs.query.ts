import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

import type { DB } from "@/server/db";
import {
  categories,
  categoriesOnPrograms,
  likes,
  programs,
  teachers,
  teachersOnPrograms,
  userProgresses,
  videos,
  videosOnPrograms,
} from "@/server/db/schema";
import type {
  Category,
  Teacher,
  UserProgress,
  Video,
} from "@/server/db/schema.types";

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

type UserProgressSelect = Pick<
  UserProgress,
  "progress" | "completed" | "watchedDuration"
> | null;

type ChapterSelect =
  | (Pick<
      Video,
      "updatedAt" | "slug" | "duration" | "description" | "thumbnail" | "title"
    > & {
      chapterNumber: number;
      isFree: boolean;
      userProgress: UserProgressSelect;
    })[]
  | null;

export const programChaptersSelect = (withUserProgress = false) => {
  const userProgressFields = withUserProgress
    ? sql`,'userProgress',
        case when ${userProgresses.progress} is not null then (jsonb_build_object(
          'watchedDuration', ${userProgresses.watchedDuration},
          'progress', ${userProgresses.progress},
          'completed', ${userProgresses.completed}
        )) else null end`
    : sql``;

  return sql<ChapterSelect>`json_agg(DISTINCT
      jsonb_build_object(
        'updatedAt', ${videos.updatedAt},
        'slug', ${videos.slug},
        'duration', ${videos.duration},
        'description', ${videos.description},
        'thumbnail', ${videos.thumbnail},
        'title', ${videos.title},
        'chapterNumber', ${videosOnPrograms.chapterNumber},
        'isFree', ${videosOnPrograms.isFree}
        ${userProgressFields})
      ) FILTER (WHERE ${videos.id} IS NOT NULL)`;
};

export const isProgramLikedByUserSubquery = ({
  db,
  userId,
}: { db: DB; userId?: string }) => {
  if (!userId) return sql<boolean>`false`.as("isLikedByUser");
  return sql<boolean>`exists(${db
    .select({ n: sql`1` })
    .from(likes)
    .where(
      and(eq(likes.programId, programs.id), eq(likes.userId, userId ?? "")),
    )})`.as("isLikedByUser");
};

export const lastWatchedChapterSubquery = ({
  db,
  userId,
}: { db: DB; userId?: string }) => {
  if (!userId) return sql<null>`null`.as("lastWatchedChapter");
  return sql<{
    chapterNumber: number;
    chapterSlug: string;
    watchedDuration: number;
    progress: number;
  } | null>`${db
    .select({
      lastWatchedChater: sql`
      jsonb_build_object(
        'chapterNumber', ${videosOnPrograms.chapterNumber},
        'chapterSlug', ${videos.slug},
        'watchedDuration', ${userProgresses.watchedDuration},
        'progress', ${userProgresses.progress}
      )
     `,
    })
    .from(userProgresses)
    .leftJoin(
      videosOnPrograms,
      and(
        eq(userProgresses.videoId, videosOnPrograms.videoId),
        eq(userProgresses.programId, programs.id),
      ),
    )
    .leftJoin(videos, eq(videos.id, videosOnPrograms.videoId))
    .where(
      and(
        eq(userProgresses.userId, userId ?? ""),
        eq(videos.id, videosOnPrograms.videoId),
      ),
    )
    .orderBy(desc(userProgresses.lastWatchedAt))
    .limit(1)}`.as("lastChapterWatched");
};

export const firstChapterSubquery = ({ db }: { db: DB }) => {
  return sql<{
    chapterNumber: number;
    chapterSlug: string;
    watchedDuration: number;
  } | null>`${db
    .select({
      firstChapter: sql`
      jsonb_build_object(
        'chapterNumber', ${videosOnPrograms.chapterNumber},
        'chapterSlug', ${videos.slug}
      )
     `,
    })
    .from(videosOnPrograms)
    .leftJoin(videos, eq(videos.id, videosOnPrograms.videoId))
    .where(eq(videos.id, videosOnPrograms.videoId))
    .orderBy(asc(videosOnPrograms.chapterNumber))
    .limit(1)}`.as("firstChapter");
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

export const programsWithChapters = <T extends PgSelect>(
  qb: T,
  userId?: string,
) => {
  qb.leftJoin(
    videosOnPrograms,
    eq(programs.id, videosOnPrograms.programId),
  ).leftJoin(videos, eq(videos.id, videosOnPrograms.videoId));

  if (userId) {
    qb.leftJoin(
      userProgresses,
      and(
        eq(programs.id, userProgresses.programId),
        eq(userProgresses.videoId, videos.id),
        eq(userProgresses.userId, userId),
      ),
    );
  }
  return qb;
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
