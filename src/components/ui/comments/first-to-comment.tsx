import { cn } from "@/lib/utils";
import Image from "next/image";

export const FirstToComment = () => {
  return (
    <div
      className={cn(
        "relative w-full flex h-full flex-row gap-1 items-center  rounded-md border border-input bg-background p-4",
        "sm:gap-2",
      )}
    >
      <div className="relative h-10 w-9">
        <Image
          alt="First to comment"
          src="/images/first-to-comment-illustration.svg"
          className=""
          fill
        />
      </div>
      <div>
        <h3 className="text-xs sm:text-sm font-semibold">
          Be the first to comment
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Share your thoughts and help others learn from your experience.
        </p>
      </div>
    </div>
  );
};
