import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/trpc/react";

import type { ExclusiveCommentSource } from "../comment.types";

export const useCommentsCount = (commentSource: ExclusiveCommentSource) => {
  const user = useCurrentUser();

  const { data, isLoading } = api.comment.getTotalCommentsBySourceId.useQuery(
    {
      ...commentSource,
    },
    { enabled: Boolean(user) },
  );

  return { commentsCount: data, isLoading };
};
