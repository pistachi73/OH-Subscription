import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";

import { getAccountByUserId } from "./server/api/lib/account";
import { getTwoFactorConirmationByUserId } from "./server/api/lib/two-factor-confirmation";
import { getUserById } from "./server/api/lib/user";

import authConfig from "@/auth.config";
import { db } from "@/server/db";
import { mysqlTable, twoFactorConirmations, users } from "@/server/db/schema";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({
          emailVerified: new Date(),
        })
        .where(eq(users.id, user.id ?? ""));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.id) return false;

      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById({ db, id: user.id });

      //Prevent signIn without email verification
      if (!existingUser?.emailVerified) return false;

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

      ({ user });

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

      return token;
    },
    //@ts-ignore
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth;
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  session: { strategy: "jwt" },
  ...authConfig,
});
