import NextAuth from "next-auth";
import prisma from "@/utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { env } from "@/env";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  secret: env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const email = String(credentials?.email ?? "").trim().toLowerCase();
          const password = String(credentials?.password ?? "");

          if (!email || !password) {
            return null;
          }

          const user = await prisma.user.findFirst({
            where: {
              email
            }
          });

          if (!user) {
            throw new Error("User not found.");
          }

          // Users created through OAuth may not have a local password.
          if (typeof user.password !== "string" || user.password.length === 0) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            return null;
          }

          return user;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    })
  ]
});
