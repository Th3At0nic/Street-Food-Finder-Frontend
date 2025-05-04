import config from "@/config";
import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const res = await fetch(`${config.backend_url}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(credentials)
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          console.error("User sync failed:", result);
          return null;
        }
        const userDecoded = jwtDecode(result.data.accessToken);
        if (userDecoded) {
          console.log({ userDecoded });
          return { ...(userDecoded as User), accessToken: result.data.accessToken };
        }
        return null;
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;
      const accountData = {
        email: user.email,
        name: user.name,
        profilePhoto: user.image,
        provider: account?.provider,
        password: `${account?.provider}${account?.access_token}`
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(accountData));
      try {
        const res = await fetch(`${config.backend_url}/users`, {
          method: "POST",
          body: formData
        });
        const result = await res.json();

        if (!res.ok || !result.success) {
          console.error("User sync failed:", result);
          return false;
        }
        // save server token
        user.accessToken = result.data.accessToken;
        const userDecoded = jwtDecode(result.data.accessToken) as User;
        if (userDecoded) {
          user.id = userDecoded.id;
          user.email = userDecoded.email;
          user.role = userDecoded.role;
          user.name = userDecoded.name;
        }
        // save the cookie by calling the setRefreshCookie function
        await fetch(`${config.public_url}/api/auth/set-refresh-cookie`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: result.data.refreshToken })
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string | null;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image as string | null;
        session.user.accessToken = token.accessToken;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: config.next_auth_secret
};
