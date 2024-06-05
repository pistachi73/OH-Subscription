import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";

import { getAccountByUserId } from "./server/api/lib/account";
import { getTwoFactorConirmationByUserId } from "./server/api/lib/two-factor-confirmation";
import { getUserById } from "./server/api/lib/user";

import authConfig from "@/auth.config";
import { db } from "@/server/db";
import { twoFactorConirmations } from "@/server/db/schema";
import type { UserRole } from "./server/db/schema.types";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  events: {
    async linkAccount() {
      // await db
      //   .update(users)
      //   .set({
      //     emailVerified: new Date(),
      //   })
      //   .where(eq(users.id, user.id ?? ""));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
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
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
