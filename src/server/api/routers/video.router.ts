import { and, eq, getTableColumns } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import { env } from "@/env";
import * as schema from "@/server/db/schema";
import {
  VideoDeleteSchema,
  VideoInsertSchema,
  VideoUpdateSchema,
} from "@/types";
import { TRPCError } from "@trpc/server";
import { isVideoLikedByUserSubquery } from "../query-utils/video.query";

export const videoRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(
      z.object({ videoSlug: z.string(), programId: z.number().optional() }),
    )
    .query(async ({ input: { videoSlug, programId }, ctx }) => {
      const { db } = ctx;
      const { user } = ctx.session ?? {};

      const [video] = await db
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

      if (!video) return null;
      let token: string | null = null;

      if (user?.isSubscribed || video.isFree) {
        const secretKey = Buffer.from(
          env.MUX_SIGNING_KEY_SECRET,
          "base64",
        ).toString("ascii");

        token = jwt.sign(
          {
            sub: video.playbackId,
            aud: "v",
            // Convert to seconds and add 1 hour
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            kid: env.MUX_SIGNING_KEY,
          },
          secretKey,
          { algorithm: "RS256" },
        );
      }

      return Object.assign(video, { playbackToken: token });
    }),

  _getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(schema.video);
  }),

  _getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;

      const [video] = await db
        .select()
        .from(schema.video)
        .where(eq(schema.video.id, id));

      return video;
    }),

  _create: adminProtectedProcedure
    .input(VideoInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { thumbnail, ...values } = input;

      const [createdVideo] = await db
        .insert(schema.video)
        .values({
          ...values,
          thumbnail: typeof thumbnail === "string" ? thumbnail : null,
        })
        .returning();

      return createdVideo;
    }),

  _update: adminProtectedProcedure
    .input(VideoUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, thumbnail, ...values } = input;

      const [toUpdateVideo] = await db
        .select({
          thumbnail: schema.video.thumbnail,
        })
        .from(schema.video)
        .where(eq(schema.video.id, Number(id)));

      let currentVideoThumbnail = toUpdateVideo?.thumbnail;

      if (typeof thumbnail === "string") {
        currentVideoThumbnail = thumbnail;
      }

      if (!thumbnail && currentVideoThumbnail) {
        await deleteFile({ fileName: currentVideoThumbnail });
        currentVideoThumbnail = null;
      }

      const [updatedVideo] = await db
        .update(schema.video)
        .set({
          ...values,
          thumbnail: thumbnail ? currentVideoThumbnail : null,
        })
        .where(eq(schema.video.id, Number(id)))
        .returning();

      return updatedVideo;
    }),

  _delete: adminProtectedProcedure
    .input(VideoDeleteSchema)
    .mutation(async ({ input: { id }, ctx }) => {
      const { db } = ctx;

      const [toDeleteVideo] = await db
        .select()
        .from(schema.video)
        .where(eq(schema.video.id, id));

      if (!toDeleteVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      if (toDeleteVideo?.thumbnail) {
        await deleteFile({ fileName: toDeleteVideo.thumbnail });
      }

      const [deletedVideo] = await db
        .delete(schema.video)
        .where(eq(schema.video.id, id))
        .returning();

      return deletedVideo;
    }),
});
