import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) return null;

        const admin = await prisma.admin.findUnique({ 
          where: { email },
          include: { role: true }
        });
        if (!admin) return null;
        if (!admin.isActive) throw new Error("Akun Anda telah dinonaktifkan.");

        const isValid = await verifyPassword(password, admin.passwordHash);
        if (!isValid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name ?? "Administrator",
          roleId: admin.roleId,
          permissions: admin.role?.permissions || [],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roleId = (user as any).roleId;
        token.permissions = (user as any).permissions || [];
      } else if (token.id) {
        // Fetch current permissions from database to support real-time updates and migration
        const admin = await prisma.admin.findUnique({
          where: { id: token.id as string },
          include: { role: true }
        });
        if (admin) {
          token.roleId = admin.roleId;
          token.permissions = admin.role?.permissions || [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roleId = token.roleId as string;
        session.user.permissions = (token.permissions as string[]) || [];
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
