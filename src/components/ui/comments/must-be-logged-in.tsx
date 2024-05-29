"use client";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const MustBeLoggedIn = () => {
  const pathname = usePathname();
  const encodedCallbackUrl = encodeURIComponent(pathname);
  return (
    <AuthButton
      mode="modal"
      formType="login"
      callbackUrl={encodedCallbackUrl}
      redirect={false}
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
            <h3 className="text-base sm:text-lg font-medium">
              Login to comment
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              You must be logged in to leave a comment.
            </p>
          </div>
        </div>
      </div>
    </AuthButton>
  );
};
