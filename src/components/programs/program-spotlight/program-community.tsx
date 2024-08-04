"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddComment } from "@/components/ui/comments/add-comment";
import { Comment } from "@/components/ui/comments/comment";

import { FirstToComment } from "@/components/ui/comments/first-to-comment";
import { useComments } from "@/components/ui/comments/hooks/use-comments";
import { useCommentsCount } from "@/components/ui/comments/hooks/use-comments-count";
import { MustBeSubscribed } from "@/components/ui/comments/must-be-subscribed";
import { SkeletonComment } from "@/components/ui/comments/skeleton-comment";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useIsSubscribed } from "@/hooks/use-is-subscribed";
import type { ProgramSpotlight } from "@/server/db/schema.types";
import { RelatedPrograms } from "./program-related";

type ProgramCommunityProps = {
  program: NonNullable<ProgramSpotlight>;
};

export const ProgramCommunity = ({ program }: ProgramCommunityProps) => {
  const isSubscribed = useIsSubscribed();
  const { commentsCount, isLoading } = useCommentsCount({
    programId: program.id,
  });

  return (
    <div className="my-8 w-full sm:mt-12">
      <div className="mb-4 flex flex-row items-center justify-between">
        <h2 className="text-lg font-medium sm:text-xl">
          Discussion {!isLoading && `(${commentsCount})`}
        </h2>
      </div>
      <div className="flex flex-col gap-5 w-full max-w-[750px] items-end">
        {isSubscribed ? (
          <ProgramCommunityComments program={program} />
        ) : (
          <MustBeSubscribed />
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
