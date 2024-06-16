import { cn } from "@/lib/utils";
import Image from "next/image";

export const FirstToComment = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative w-full text-sm sm:text-base flex h-full flex-row gap-3  rounded-md border border-input bg-background p-4",
        className,
      )}
    >
      <div className="relative h-10 sm:h-12 w-9 sm:w-10 items-start">
        <Image
          alt="First to comment"
          src="/images/first-to-comment-illustration.svg"
          className=""
          fill
        />
      </div>
      <div>
        <h3 className="font-semibold">Be the first to comment</h3>
        <p className="hidden sm:block text-muted-foreground line-clamp-1">
          Share your thoughts and help others learn from your experience.
        </p>
        <p className="block sm:hidden text-muted-foreground line-clamp-1">
          Share your thoughts and help others
        </p>
      </div>
    </div>
  );
};
