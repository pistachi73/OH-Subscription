import { authRouter } from "./routers/auth.router";
import { categoryRouter } from "./routers/category.router";
import { programRouter } from "./routers/program.router";
import { teacherRouter } from "./routers/teacher.router";
import { userRouter } from "./routers/user.router";
import { videoRouter } from "./routers/video.router";

import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  teacher: teacherRouter,
  video: videoRouter,
  program: programRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
