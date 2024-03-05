import { useSession } from "next-auth/react";

import { type ExtendedUser } from "@/next-auth";

export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user as ExtendedUser;
};
