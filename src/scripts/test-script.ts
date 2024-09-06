import { GetCommentBySourceIdSchema } from "@/types";
import type { z } from "zod";

type GetCommentBySourceId = z.infer<typeof GetCommentBySourceIdSchema>;

const parse = {
  programId: 1,
  pageSize: 5,
  videoId: 2,
  cursor: new Date(),
};

const res = GetCommentBySourceIdSchema.safeParse(parse);

if (!res.success) {
  console.log(res.error.flatten());
}

res || console.log("invalid");
