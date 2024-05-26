import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton";

type SkeletonCommentProps = {
  isReply?: boolean;
};

export const SkeletonComment = ({ isReply }: SkeletonCommentProps) => {
  return (
    <div className={cn(isReply && "flex-end flex w-full flex-col items-end ")}>
      <div
        className={cn(
          "relative flex w-full flex-col gap-2  rounded-md border border-input bg-background p-4",
          "sm:gap-3",
          {
            "w-11/12 justify-end sm:w-4/5": isReply,
            "w-full": !isReply,
          },
        )}
      >
        <div className="flex flex-row items-center  gap-1 sm:gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>

        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[82%]" />
        <Skeleton className="h-4 w-[85%]" />
      </div>
    </div>
  );
};