import type { NextAuthConfig } from "next-auth";

// Edge-safe part of the auth config (no Prisma or bcrypt), shared by auth.ts and the middleware.
export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [],
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
  }
} satisfies NextAuthConfig;
