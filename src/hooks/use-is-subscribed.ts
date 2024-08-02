import { useCustomSession } from "@/components/auth/auth-session-provider";
import type { ExtendedUser } from "@/next-auth";

export const useIsSubscribed = () => {
  const session = useCustomSession();

  return (session?.user as ExtendedUser)?.isSubscribed ?? false;
};
