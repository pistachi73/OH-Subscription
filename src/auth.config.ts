import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { db } from "@/server/db";
import { LoginSchema } from "@/types";
import { user } from "./server/db/schema";

export default {
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const res = await db.query.user.findFirst({
            where: eq(user.email, email),
          });
          if (!res || !res.password) return null;

          const passwordsMatch = await bcrypt.compare(password, res.password);
          if (passwordsMatch) {
            return res;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
