import { useCurrentUser } from "./use-current-user";

export type UserStatus =
  | "LOGGED_IN_SUBSCRIBED"
  | "LOGGED_IN_UNSUBSCRIBED"
  | "LOGGED_OUT";

export const useUserStatus = (): UserStatus => {
  const user = useCurrentUser();

  if (!user) return "LOGGED_OUT";

  if (user.isSubscribed) return "LOGGED_IN_SUBSCRIBED";

  return "LOGGED_IN_UNSUBSCRIBED";
};
