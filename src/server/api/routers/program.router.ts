import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { deleteFile } from "@/actions/delete-file";
import { isNumber } from "@/lib/utils";
import { ProgramSchema } from "@/schemas";
import { programs } from "@/server/db/schema";

export const programRouter = createTRPCRouter({
  delete: adminProtectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const { db } = ctx;
      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Program ID is required",
        });
      }

      const program = await db
        .select()
        .from(programs)
        .where(eq(programs.id, id));
      const thumbnail = program?.[0]?.thumbnail;

      if (thumbnail) {
        await deleteFile({ fileName: thumbnail });
      }

      await db.delete(programs).where(eq(programs.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(ProgramSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { thumbnail, ...values } = input;

      await db.insert(programs).values({
        ...values,
        thumbnail: typeof thumbnail === "string" ? thumbnail : null,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(ProgramSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, thumbnail, ...values } = input;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Program ID is required",
        });
      }

      const program = await db
        .select()
        .from(programs)
        .where(eq(programs.id, Number(id)));

      let currentProgramThumbnail = program?.[0]?.thumbnail;

      if (typeof thumbnail === "string") {
        currentProgramThumbnail = thumbnail;
      }

      if (!thumbnail && currentProgramThumbnail) {
        await deleteFile({ fileName: currentProgramThumbnail });
        currentProgramThumbnail = null;
      }

      await db
        .update(programs)
        .set({
          ...values,
          thumbnail: thumbnail ? currentProgramThumbnail : null,
        })
        .where(eq(programs.id, Number(id)));

      return { success: true, id: Number(id) };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allPrograms = await db.select().from(programs);
    return allPrograms;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;
      const program = await db
        .select()
        .from(programs)
        .where(eq(programs.id, id));
      return program[0];
    }),
});
