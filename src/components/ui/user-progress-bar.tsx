"use client";

import { useUserStatus } from "@/hooks/use-user-status";
import { cn } from "@/lib/utils";

export const UserProgressBar = ({
  progress,
  className,
  progressClassName,
}: {
  progress?: number | null;
  className?: string;
  progressClassName?: string;
}) => {
  const userStatus = useUserStatus();

  if (!progress || userStatus !== "LOGGED_IN_SUBSCRIBED") return null;

  return (
    <div className={cn("w-full flex flex-col gap-1 items-end", className)}>
      <span className="w-full h-[5px] bg-accent/80 rounded-full relative ">
        <span
          className={cn(
            "bg-secondary h-full rounded-full block",
            progressClassName,
          )}
          style={{
            width: `${progress}%`,
          }}
        />
      </span>
    </div>
  );
};
