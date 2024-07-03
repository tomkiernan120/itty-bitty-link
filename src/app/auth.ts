import NextAuth from "next-auth";
import prisma from "@/utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials;

          const user = await prisma.user.findFirst({
            where: {
              email: email
            }
          });

          if (!user) {
            throw new Error("User not found.");
          }

          if (user && bcrypt.compareSync(password, user.password)) {
            console.log("User found");
            return user;
          }

          return null;
        } catch (error) {
          console.log(error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      console.log("session");
      console.log(session);
      console.log(token);
      console.log(user);
      session.userId = user.id;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("jwt");
      console.log(token);
      console.log(user);
      console.log(account);
      console.log(profile);
      console.log(isNewUser);
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/error",
    verifyRequest: "/auth/verify-request",
  }
});
