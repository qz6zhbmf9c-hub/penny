import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    // Adds id + isPro to the session so the UI can gate Pro features
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isPro = (user as { isPro?: boolean }).isPro ?? false;
      }
      return session;
    },
  },
};