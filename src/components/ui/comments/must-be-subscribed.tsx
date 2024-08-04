import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserStatusLink } from "../user-status-link";

export const MustBeSubscribed = () => {
  return (
    <UserStatusLink
      href="/"
      className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
    >
      <div
        className={cn(
          "transition-colors hover:bg-accent relative w-full flex h-full flex-col gap-3 rounded-md border border-input bg-background p-4",
        )}
      >
        <div className="flex gap-3">
          <div className="relative h-10 sm:h-12 w-9 sm:w-10">
            <Image
              alt="login required to comment"
              src="/images/lock-illustration.svg"
              fill
            />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-medium text-left">
              Become an OH Premium member
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              You must be subscribed in to leave a comment.
            </p>
          </div>
        </div>
      </div>
    </UserStatusLink>
  );
};
