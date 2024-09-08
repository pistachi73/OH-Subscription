import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import { ArrowLeftIcon } from "../ui/icons";
import { useChapterContext } from "./chapter-context";

export const NotAllowedChapter = () => {
  const { program } = useChapterContext();
  const { isMobile } = useDeviceType();
  return (
    <div
      className={cn(
        "w-full flex items-center justify-center flex-col z-50 absolute top-0 left-0 gap-2 pointer-events-none",
        isMobile ? "h-[var(--aspect-ratio-height)]" : "h-full",
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2 md:gap-3 bg-muted-background rounded-lg p-3 md:p-6">
        <div className="relative h-10 sm:h-12 w-9 sm:w-10">
          <Image
            alt="login required to comment"
            src="/images/lock-illustration.svg"
            fill
          />
        </div>
        <p className="max-w-[20ch] text-center text-sm lg:text-lg">
          You are not allowed to watch this chapter
        </p>
        <Button
          className={cn(
            "pointer-events-auto",
            isMobile ? "h-10 text-sm px-4" : "h-14 px-9 text-lg",
          )}
          variant={"default"}
          asChild
        >
          <Link href={`/programs/${program.slug}`}>
            <ArrowLeftIcon className="w-4 h-4 text-background dark:text-foreground mr-2" />
            Back to program
          </Link>
        </Button>
      </div>
    </div>
  );
};
