import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            image: true,
          },
        });
        if (!user || !user.password) return null;

        const valid = await compare(credentials!.password, user.password);
        return valid ? user : null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token.image) {
        session.user.image = token.image as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.image = user.image;
      }
      return token;
    },
  },
  events: {
    async signIn(message) {
      console.log("User signed in", message);
    },
    async signOut(message) {
      console.log("User signed out", message);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
