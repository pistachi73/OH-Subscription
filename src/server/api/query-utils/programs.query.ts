import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

import type { DB } from "@/server/db";
import {
  category,
  categoryProgram,
  like,
  program,
  teacher,
  teacherProgram,
  userProgress,
  video,
  videoProgram,
} from "@/server/db/schema";
import type { Category, Teacher, UserProgress, Video } from "@/types";

export const sharedProgramSelect = {
  id: program.id,
  title: program.title,
  description: program.description,
  thumbnail: program.thumbnail,
  level: program.level,
  slug: program.slug,
  totalChapters: program.totalChapters,
  updatedAt: program.updatedAt,
};

export const programCategoriesSelect = sql<Category[] | null>`json_agg(DISTINCT
  jsonb_build_object(
    'id', ${category.id},
    'name', ${category.name},
    'slug', ${category.slug})
  ) FILTER (WHERE ${category.id} IS NOT NULL)`;

export const programTeachersSelect = sql<Omit<Teacher, "bio">[] | null>`json_agg(DISTINCT
  jsonb_build_object(
    'id', ${teacher.id},
    'image', ${teacher.image},
    'name', ${teacher.name})
  ) FILTER (WHERE ${teacher.id} IS NOT NULL)`;

type UserProgressSelect = Pick<
  UserProgress,
  "progress" | "completed" | "watchedDuration" | "lastWatchedAt"
> | null;

export type ChapterSelect =
  | (Pick<
      Video,
      | "id"
      | "updatedAt"
      | "slug"
      | "duration"
      | "description"
      | "thumbnail"
      | "title"
    > & {
      chapterNumber: number;
      isFree: boolean;
      userProgress: UserProgressSelect;
    })[]
  | null;

export const programChaptersSelect = (withUserProgress = false) => {
  const userProgressFields = withUserProgress
    ? sql`,'userProgress',
        case when ${userProgress.progress} is not null then (jsonb_build_object(
          'lastWatchedAt', ${userProgress.lastWatchedAt},
          'watchedDuration', ${userProgress.watchedDuration},
          'progress', ${userProgress.progress},
          'completed', ${userProgress.completed}
        )) else null end`
    : sql``;

  return sql<ChapterSelect>`json_agg(DISTINCT
      jsonb_build_object(
        'id', ${video.id},
        'slug', ${video.slug},
        'updatedAt', ${video.updatedAt},
        'duration', ${video.duration},
        'description', ${video.description},
        'thumbnail', ${video.thumbnail},
        'title', ${video.title},
        'chapterNumber', ${videoProgram.chapterNumber},
        'isFree', ${videoProgram.isFree}
        ${userProgressFields})
      ) FILTER (WHERE ${video.id} IS NOT NULL)`;
};

export const isProgramLikedByUserSubquery = ({
  db,
  userId,
}: { db: DB; userId?: string }) => {
  if (!userId) return sql<boolean>`false`.as("isLikedByUser");
  return sql<boolean>`exists(${db
    .select({ n: sql`1` })
    .from(like)
    .where(
      and(eq(like.programId, program.id), eq(like.userId, userId ?? "")),
    )})`.as("isLikedByUser");
};

export const lastWatchedChapterSubquery = ({
  db,
  userId,
}: { db: DB; userId?: string }) => {
  if (!userId) return sql<null>`null`.as("lastWatchedChapter");
  return sql<{
    chapterNumber: number;
    slug: string;
    watchedDuration: number;
    progress: number;
  } | null>`${db
    .select({
      lastWatchedChater: sql`
      jsonb_build_object(
        'chapterNumber', ${videoProgram.chapterNumber},
        'slug', ${video.slug},
        'watchedDuration', ${userProgress.watchedDuration},
        'progress', ${userProgress.progress}
      )
     `,
    })
    .from(userProgress)
    .leftJoin(
      videoProgram,
      and(
        eq(userProgress.videoId, videoProgram.videoId),
        eq(userProgress.programId, program.id),
      ),
    )
    .leftJoin(video, eq(video.id, videoProgram.videoId))
    .where(
      and(
        eq(userProgress.userId, userId ?? ""),
        eq(video.id, videoProgram.videoId),
      ),
    )
    .orderBy(desc(userProgress.lastWatchedAt))
    .limit(1)}`.as("lastChapterWatched");
};

export const firstChapterSubquery = ({ db }: { db: DB }) => {
  return sql<{
    chapterNumber: number;
    slug: string;
  } | null>`${db
    .select({
      firstChapter: sql`
      jsonb_build_object(
        'chapterNumber', ${videoProgram.chapterNumber},
        'slug', ${video.slug}        
      )
     `,
    })
    .from(videoProgram)
    .rightJoin(
      video,
      and(
        eq(video.id, videoProgram.videoId),
        eq(program.id, videoProgram.programId),
      ),
    )
    .where(eq(video.id, videoProgram.videoId))
    .orderBy(asc(videoProgram.chapterNumber))
    .limit(1)}`.as("firstChapter");
};

export const programsWithCategories = <T extends PgSelect>(qb: T) => {
  return qb
    .leftJoin(categoryProgram, eq(program.id, categoryProgram.programId))
    .leftJoin(category, eq(category.id, categoryProgram.categoryId));
};

export const programsWithTeachers = <T extends PgSelect>(qb: T) => {
  return qb
    .leftJoin(teacherProgram, eq(program.id, teacherProgram.programId))
    .leftJoin(teacher, eq(teacher.id, teacherProgram.teacherId));
};

export const programsWithChapters = <T extends PgSelect>(
  qb: T,
  userId?: string,
) => {
  qb.leftJoin(videoProgram, eq(program.id, videoProgram.programId)).leftJoin(
    video,
    eq(video.id, videoProgram.videoId),
  );

  if (userId) {
    qb.leftJoin(
      userProgress,
      and(
        eq(program.id, userProgress.programId),
        eq(userProgress.videoId, video.id),
        eq(userProgress.userId, userId),
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
    return qb.where(inArray(teacher.id, teacherIds));
  }

  return qb.where(eq(teacher.id, teacherIds));
};

export const filterProgramsByCategoryId = <T extends PgSelect>(
  qb: T,
  categoryIds: number | number[],
) => {
  if (Array.isArray(categoryIds)) {
    return qb.where(inArray(category.id, categoryIds));
  }

  return qb.where(eq(category.id, categoryIds));
};

export const filterProgramsByCategoryName = <T extends PgSelect>(
  qb: T,
  categoryNames: string | string[],
) => {
  if (Array.isArray(categoryNames)) {
    const lowerCategoryNames = categoryNames.map((name) => name.toLowerCase());
    return qb.where(inArray(sql`lower(${category.name})`, lowerCategoryNames));
  }

  return qb.where(
    eq(sql`lower(${category.name})`, sql`lower(${categoryNames})`),
  );
};
