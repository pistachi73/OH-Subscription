import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { isNumber } from "@/lib/utils";
import { VideoSchema } from "@/schemas";
import { videos } from "@/server/db/schema";

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

      await db.delete(videos).where(eq(videos.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(VideoSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      //   const { values } = input;

      await db.insert(videos).values(input);

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(VideoSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required",
        });
      }

      await db
        .update(videos)
        .set({ ...values, updatedAt: sql`CURRENT_TIMESTAMP` })
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
      const video = await db.select().from(videos).where(eq(videos.id, id));
      return video[0];
    }),
});
