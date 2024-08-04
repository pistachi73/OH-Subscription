import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import { toKebabCase } from "@/lib/case-converters";
import { isNumber } from "@/lib/utils";
import { VideoSchema } from "@/schemas";
import { videos, videosOnPrograms } from "@/server/db/schema";
import { isVideoLikedByUserSubquery } from "../query-utils/video.query";

export const videoRouter = createTRPCRouter({
  delete: adminProtectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const { db } = ctx;
      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required",
        });
      }
      const video = await db.select().from(videos).where(eq(videos.id, id));
      const thumbnail = video?.[0]?.thumbnail;

      if (thumbnail) {
        await deleteFile({ fileName: thumbnail });
      }

      await db.delete(videos).where(eq(videos.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(VideoSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { thumbnail, ...values } = input;

      await db.insert(videos).values({
        ...values,
        slug: toKebabCase(values.title) as string,
        thumbnail: typeof thumbnail === "string" ? thumbnail : null,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(VideoSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, thumbnail, ...values } = input;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required",
        });
      }

      const video = await db
        .select()
        .from(videos)
        .where(eq(videos.id, Number(id)));

      let currentVideoThumbnail = video?.[0]?.thumbnail;

      if (typeof thumbnail === "string") {
        currentVideoThumbnail = thumbnail;
      }

      if (!thumbnail && currentVideoThumbnail) {
        await deleteFile({ fileName: currentVideoThumbnail });
        currentVideoThumbnail = null;
      }

      await db
        .update(videos)
        .set({
          ...values,
          slug: toKebabCase(values.title) as string,
          thumbnail: thumbnail ? currentVideoThumbnail : null,
        })
        .where(eq(videos.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allVideos = await db.select().from(videos);
    return allVideos;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;

      const videoList = await db.select().from(videos).where(eq(videos.id, id));
      const video = videoList?.[0];
      return video;
    }),

  getBySlug: publicProcedure
    .input(
      z.object({ videoSlug: z.string(), programId: z.number().optional() }),
    )
    .query(async ({ input: { videoSlug, programId }, ctx }) => {
      const { db } = ctx;

      console.log({
        videoSlug,
        programId,
      });

      const res = await db
        .select({
          ...getTableColumns(videos),
          chapterNumber: videosOnPrograms.chapterNumber,
          isFree: videosOnPrograms.isFree,
          isLikedByUser: isVideoLikedByUserSubquery({
            db: ctx.db,
            userId: ctx.session?.user?.id,
          }),
        })
        .from(videos)
        .leftJoin(
          videosOnPrograms,
          and(
            eq(videos.id, videosOnPrograms.videoId),
            programId ? eq(videosOnPrograms.programId, programId) : undefined,
          ),
        )
        .where(and(eq(videos.slug, videoSlug)));

      console.log({ res });

      const video = res?.[0];

      return video;
    }),
});
