import { useCustomSession } from "@/components/auth/auth-session-provider";
import type { ExtendedUser } from "@/next-auth";

export const useCurrentUser = () => {
  const session = useCustomSession();

  return session?.user as ExtendedUser;
};
