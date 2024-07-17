import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton";

type SkeletonCommentProps = {
  className?: string;
  isReply?: boolean;
  level?: number;
};

export const SkeletonComment = ({
  className,
  level = 0,
}: SkeletonCommentProps) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-2",
        "w-[var(--mobile-comment-width)] sm:w-[var(--desktop-comment-width)]",
        className,
      )}
      style={{
        "--mobile-comment-width": `calc(100% - ${level * 44}px)`,
        "--desktop-comment-width": `calc(100% - ${level * 52}px)`,
      }}
    >
      <div className="flex flex-row text-sm gap-3">
        <Skeleton className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-[85%]" />
          <Skeleton className="h-3 w-[78%]" />
          <Skeleton className="h-3 w-[82%]" />
        </div>
      </div>
    </div>
  );
};
