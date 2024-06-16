import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton";

type SkeletonCommentProps = {
  className?: string;
  isReply?: boolean;
};

export const SkeletonComment = ({
  isReply,
  className,
}: SkeletonCommentProps) => {
  return (
    <div
      className={cn("w-full", isReply && "flex-end flex flex-col items-end")}
    >
      <div
        className={cn(
          "relative flex w-full flex-col gap-2  rounded-md border border-input bg-background p-4",
          "sm:gap-3",
          {
            "w-11/12 justify-end": isReply,
            "w-full": !isReply,
          },
          className,
        )}
      >
        <div className="flex flex-row items-center  gap-1 sm:gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>

        <Skeleton className="h-3 w-[90%]" />
        <Skeleton className="h-3 w-[82%]" />
        <Skeleton className="h-3 w-[85%]" />
      </div>
    </div>
  );
};
