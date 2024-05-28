import { cn } from "@/lib/utils";
import Image from "next/image";

export const FirstToComment = () => {
  return (
    <div
      className={cn(
        "relative w-full flex h-full flex-row gap-3 items-center  rounded-md border border-input bg-background p-4",
      )}
    >
      <div className="relative h-10 sm:h-12 w-9 sm:w-10">
        <Image
          alt="First to comment"
          src="/images/first-to-comment-illustration.svg"
          className=""
          fill
        />
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-semibold">
          Be the first to comment
        </h3>
        <p className="hidden sm:block text-sm sm:text-base text-muted-foreground line-clamp-1">
          Share your thoughts and help others learn from your experience.
        </p>
        <p className="block sm:hidden text-sm sm:text-base text-muted-foreground line-clamp-1">
          Share your thoughts and help others
        </p>
      </div>
    </div>
  );
};
