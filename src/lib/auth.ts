import { auth } from "@/auth";

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
