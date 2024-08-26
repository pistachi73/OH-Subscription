import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";

import { getAccountByUserId } from "./server/api/lib/account";
import { getTwoFactorConirmationByUserId } from "./server/api/lib/two-factor-confirmation";
import { getUserById } from "./server/api/lib/user";

import authConfig from "@/auth.config";
import { db } from "@/server/db";
import { twoFactorConirmations, users } from "@/server/db/schema";
import { Stripe } from "stripe";
import { env } from "./env";
import type { UserRole } from "./server/db/schema.types";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  events: {
    async createUser({ user }) {
      console.log("createUser");

      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-04-10",
      });

      await stripe.customers
        .create({
          email: user.email as string,
          name: user.name as string,
        })
        .then(async (customer) => {
          await db
            .update(users)
            .set({ stripeCustomerId: customer.id })
            .where(eq(users.id, user.id as string));
        });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("signIn");
      if (!user.id) return false;

      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById({ db, id: user.id });

      if (!existingUser) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConirmationByUserId({
          db,
          userId: existingUser.id,
        });

        if (!twoFactorConfirmation) {
          return false;
        }

        await db
          .delete(twoFactorConirmations)
          .where(eq(twoFactorConirmations.id, twoFactorConfirmation.id));
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const user = await getUserById({ db, id: token.sub });

      if (!user) return token;

      const existingAccount = await getAccountByUserId({ db, userId: user.id });

      token.isOAuth = !!existingAccount;
      token.name = user.name;
      token.email = user.email;
      token.role = user.role;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;
      token.stripeCustomerId = user.stripeCustomerId;
      token.stripeSubscriptionId = user.stripeSubscriptionId;
      token.stripeSubscriptionEndsOn = user.stripeSubscriptionEndsOn;

      return token;
    },
    //@ts-ignore
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = (token.role as UserRole) ?? "USER";
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.stripeCustomerId = token.stripeCustomerId as string;
        session.user.stripeSubscriptionId =
          token.stripeSubscriptionId as string;
        session.user.stripeSubscriptionEndsOn =
          token.stripeSubscriptionEndsOn as Date;

        session.user.isSubscribed = token.stripeSubscriptionEndsOn
          ? (token.stripeSubscriptionEndsOn as Date) > new Date()
          : false;
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
