import NextAuth, { type DefaultSession } from "next-auth";
import { User } from './server/db/schema.types';

export type ExtendedUser = DefaultSession["user"] & {
  role: "ADMIN" | "USER";
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeSubscriptionEndsOn: Date;
  isSubscribed: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User extends ExtendedUser {}
}
