"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddComment } from "@/components/ui/comments/add-comment";
import { Comment } from "@/components/ui/comments/comment";

import { FirstToComment } from "@/components/ui/comments/first-to-comment";
import { useComments } from "@/components/ui/comments/hooks/use-comments";
import { MustBeLoggedIn } from "@/components/ui/comments/must-be-logged-in";
import { SkeletonComment } from "@/components/ui/comments/skeleton-comment";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ProgramSpotlight } from "@/server/db/schema.types";
import { api } from "@/trpc/react";
import { RelatedPrograms } from "./program-related";

type ProgramCommunityProps = {
  program: NonNullable<ProgramSpotlight>;
};

export const ProgramCommunity = ({ program }: ProgramCommunityProps) => {
  const user = useCurrentUser();
  const { data, isLoading } = api.comment.getTotalCommentsBySourceId.useQuery(
    {
      programId: program.id,
    },
    { enabled: Boolean(user) },
  );

  console.log({ totalComments: data });

  return (
    <div className="my-8 w-full sm:mt-12">
      <div className="mb-4 flex flex-row items-center justify-between">
        <h2 className="text-lg font-medium sm:text-xl">
          Discussion {!isLoading && `(${data})`}
        </h2>
      </div>
      <div className="flex flex-col gap-5 w-full max-w-[750px] items-end">
        {user ? (
          <ProgramCommunityComments program={program} />
        ) : (
          <div className="flex items-center justify-center h-full py-4 w-full">
            <MustBeLoggedIn />
          </div>
        )}
      </div>
      <RelatedPrograms program={program} />
    </div>
  );
};

export const ProgramCommunityComments = ({
  program,
}: ProgramCommunityProps) => {
  const user = useCurrentUser();

  const {
    onComment,
    comments,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useComments({
    programId: program.id,
  });

  return (
    <>
      <div className="flex flex-row gap-3 w-full">
        <UserAvatar
          userImage={user?.image}
          userName={user?.name}
          className="w-8 h-8 md:w-10 md:h-10 text-sm sm:text-base"
        />
        <AddComment
          placeholder="Add your comment..."
          containerClassName="w-full"
          commentLabel="Comment"
          onComment={onComment}
        />
      </div>
      {isLoading ? (
        <>
          <SkeletonComment />
          <SkeletonComment />
        </>
      ) : !comments?.length ? (
        <FirstToComment />
      ) : (
        comments?.map((comment) => (
          <Comment key={comment.id} comment={comment} programId={program.id} />
        ))
      )}

      {hasNextPage && (
        <div className="flex justify-center w-full mt-4">
          <Button
            type="button"
            variant={"ghost"}
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load more
          </Button>
        </div>
      )}
    </>
  );
};
