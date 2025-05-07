import config from "@/config";
import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { TRole } from "@/types";

import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const refreshAccessToken = async (token: any) => {
  try {
    const refreshToken = (await cookies()).get("refresh_token")?.value;
    console.log({ refreshToken });
    if (!refreshToken) throw new Error("Missing refresh token cookie");

    const res = await fetch(`${config.backend_url}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`
      }
    });

    const result = await res.json();
    if (!res.ok || !result.success) throw result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = jwtDecode(result.data.accessToken) as any;

    return {
      ...token,
      accessToken: result.data.accessToken,
      accessTokenExpires: decoded.exp * 1000
    };
  } catch (err) {
    console.error("Failed to refresh access token", err);
    return {
      ...token,
      error: "RefreshAccessTokenError"
    };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials, req) {
        const res = await fetch(`${config.backend_url}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(credentials)
        });
        const setCookieHeader = res.headers.get("set-cookie");

        if (setCookieHeader) {
          const refreshCookies = setCookieHeader.split(";");
          const refreshTokenCookie = refreshCookies.find((cookie) => cookie.trim().startsWith("refreshToken="));
          if (refreshTokenCookie) {
            const refreshToken = refreshTokenCookie.split("=")[1].split(";")[0];
            (await cookies()).set("refresh_token", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7,
              path: "/"
            });
          }
        }

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
      console.log({ user, account });
      if (account?.provider === "credentials") return true;
      const accountData = {
        email: user.email,
        name: user.name,
        profilePhoto: user.image,
        provider: account?.provider,
        password: `${account?.provider}${account?.access_token}`
      };
      console.log({ accountData });
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
        (await cookies()).set("refresh_token", result.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/"
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
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string | null;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image as string | null;
        session.user.accessToken = token.accessToken;
        session.user.role = token.role as TRole;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: config.next_auth_secret
};
