import { auth } from "@/auth";
import type { UserStatus } from "@/hooks/use-user-status";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};
export const currentRole = async () => {
  const session = await auth();
  return session?.user.role;
};

export const isUserSubscribed = async () => {
  const session = await auth();
  return session?.user.isSubscribed;
};

export const getUserStatus = async (): Promise<UserStatus> => {
  const user = await currentUser();

  if (!user) return "LOGGED_OUT";

  if (user.isSubscribed) return "LOGGED_IN_SUBSCRIBED";

  return "LOGGED_IN_UNSUBSCRIBED";
};
