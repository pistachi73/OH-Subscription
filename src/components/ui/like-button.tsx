import { AuthButton } from "@/components/auth/auth-button";
import { Button, type ButtonProps } from "@/components/ui/button";
import { HeartIcon, HeartOutlineIcon } from "@/components/ui/icons";
import { useCurrentUser } from "@/hooks/use-current-user";

import { cn } from "@/lib/utils/cn";
import { createContext, forwardRef, useContext } from "react";

type LikeButtonContextType = {
  isLikedByUser?: boolean;
  isLikeLoading?: boolean;
  like?: (args: { programId: number }) => void;
};

export const LikeButtonContext = createContext<LikeButtonContextType>({
  isLikedByUser: false,
  isLikeLoading: false,
  like: () => {},
});

export function useLikeButton() {
  const context = useContext(LikeButtonContext);

  if (!context) {
    throw new Error("useLikeButton must be used within a <LikeButton />");
  }

  return context;
}

type LikeButtonProps = ButtonProps & {
  children: React.ReactNode;
  isLikedByUser: boolean;
  isLikeLoading: boolean;
  like: () => void;
  asChild?: boolean;
};

export const LikeButton = forwardRef<HTMLButtonElement, LikeButtonProps>(
  (
    {
      children,
      isLikeLoading,
      isLikedByUser,
      like,
      className,
      asChild,
      ...rest
    },
    ref,
  ) => {
    const user = useCurrentUser();
    const isLoggedIn = user?.id;
    return (
      <LikeButtonContext.Provider
        value={{ isLikedByUser, isLikeLoading, like }}
      >
        {isLoggedIn ? (
          <Button
            ref={ref}
            className={cn("disabled:opacity-100", className)}
            {...rest}
            //TODO: do we need to disable the button?
            disabled={isLikeLoading}
            onClick={() => like()}
            asChild={asChild}
          >
            {children}
          </Button>
        ) : (
          <AuthButton mode="modal" asChild>
            <Button
              ref={ref}
              className={cn("disabled:opacity-100", className)}
              asChild={asChild}
              {...rest}
            >
              {children}
            </Button>
          </AuthButton>
        )}
      </LikeButtonContext.Provider>
    );
  },
);

export const LikeButtonIcon = ({ className }: { className?: string }) => {
  const { isLikedByUser } = useLikeButton();
  return isLikedByUser ? (
    <HeartIcon className={cn("text-red-500", className)} />
  ) : (
    <HeartOutlineIcon className={cn(className)} />
  );
};

export const LikeButtonLabel = ({
  className,
  likedLabel,
  unlikedLabel,
}: { likedLabel: string; unlikedLabel: string; className?: string }) => {
  const { isLikedByUser } = useLikeButton();

  return (
    <p className={cn("text-sm", className)}>
      {isLikedByUser ? likedLabel : unlikedLabel}
    </p>
  );
};
