import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

import { isNumber } from "@/lib/utils";
import { ShotSchema } from "@/schemas";
import { shots } from "@/server/db/schema";

export const shotRouter = createTRPCRouter({
  delete: adminProtectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const { db } = ctx;
      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "shot ID is required",
        });
      }
      await db.delete(shots).where(eq(shots.id, id));

      return { success: true };
    }),
  create: adminProtectedProcedure
    .input(ShotSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { ...values } = input;

      await db.insert(shots).values({
        ...values,
      });

      return { success: true };
    }),

  update: adminProtectedProcedure
    .input(ShotSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id, ...values } = input;

      if (!id || !isNumber(id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "shot ID is required",
        });
      }

      const shot = await db
        .select()
        .from(shots)
        .where(eq(shots.id, Number(id)));

      await db
        .update(shots)
        .set({
          ...values,
        })
        .where(eq(shots.id, Number(id)));

      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const allshots = await db.select().from(shots);
    return allshots;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const { db } = ctx;
      const shot = await db.select().from(shots).where(eq(shots.id, id));
      return shot[0];
    }),
});
