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
          return userDecoded as User;
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
    async jwt({ token, user, account, profile }) {
      console.log(token);
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: config.next_auth_secret
};
