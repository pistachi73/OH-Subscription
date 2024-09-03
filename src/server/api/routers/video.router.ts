import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import { isNumber } from "@/lib/utils/is-number";
import * as schema from "@/server/db/schema";
import { VideoInsertSchema } from "@/types";
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
      const video = await db
        .select()
        .from(schema.video)
        .where(eq(schema.video.id, id));
      const thumbnail = video?.[0]?.thumbnail;

      if (thumbnail) {
        await deleteFile({ fileName: thumbnail });
      }

      await db.delete(schema.video).where(eq(schema.video.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(VideoInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { thumbnail, ...values } = input;

      await db.insert(schema.video).values({
        ...values,
        thumbnail: typeof thumbnail === "string" ? thumbnail : null,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(VideoInsertSchema)
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
        .from(schema.video)
        .where(eq(schema.video.id, Number(id)));

      let currentVideoThumbnail = video?.[0]?.thumbnail;

      if (typeof thumbnail === "string") {
        currentVideoThumbnail = thumbnail;
      }

      if (!thumbnail && currentVideoThumbnail) {
        await deleteFile({ fileName: currentVideoThumbnail });
        currentVideoThumbnail = null;
      }

      await db
        .update(schema.video)
        .set({
          ...values,
          thumbnail: thumbnail ? currentVideoThumbnail : null,
        })
        .where(eq(schema.video.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allVideos = await db.select().from(schema.video);
    return allVideos;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;

      const videoList = await db
        .select()
        .from(schema.video)
        .where(eq(schema.video.id, id));
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
          ...getTableColumns(schema.video),
          chapterNumber: schema.videoProgram.chapterNumber,
          isFree: schema.videoProgram.isFree,
          isLikedByUser: isVideoLikedByUserSubquery({
            db: ctx.db,
            userId: ctx.session?.user?.id,
          }),
        })
        .from(schema.video)
        .leftJoin(
          schema.videoProgram,
          and(
            eq(schema.video.id, schema.videoProgram.videoId),
            programId
              ? eq(schema.videoProgram.programId, programId)
              : undefined,
          ),
        )
        .where(and(eq(schema.video.slug, videoSlug)));

      console.log({ res });

      const video = res?.[0];

      return video;
    }),
});
