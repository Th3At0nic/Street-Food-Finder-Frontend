/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/config";
import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { TRole } from "@/types";

const refreshAccessToken = async (token: any) => {
  try {
    // Use the refresh token from the token object
    const refreshToken = token.refreshToken;
    console.log({ refreshToken });
    if (!refreshToken) throw new Error("Missing refresh token");

    // Make API call to refresh token
    const res = await fetch(`${config.backend_url}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`
      },
      body: JSON.stringify({ refreshToken })
    });

    const result = await res.json();
    if (!res.ok || !result.success) throw result;

    await fetch(`${config.public_url}/api/auth/set-refresh-cookie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refreshToken: result.data.refreshToken || refreshToken
      })
    });

    const decoded = jwtDecode(result.data.accessToken) as any;
    console.log("Decoded access token after refresh:", decoded);
    return {
      ...token,
      role: decoded.role,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken || token.refreshToken,
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
        let refreshToken = null;

        if (setCookieHeader) {
          const refreshCookies = setCookieHeader.split(";");
          const refreshTokenCookie = refreshCookies.find((cookie) => cookie.trim().startsWith("refreshToken="));
          if (refreshTokenCookie) {
            refreshToken = refreshTokenCookie.split("=")[1].split(";")[0];
            // We'll use this refreshToken in the session/token
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
          return {
            ...(userDecoded as User),
            accessToken: result.data.accessToken,
            refreshToken: refreshToken || result.data.refreshToken
          };
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
        // Store the refresh token in the user object to be passed to the token
        user.refreshToken = result.data.refreshToken;
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    async jwt({ token, user, trigger }) {
      if (trigger == "update") {
        return await refreshAccessToken(token);
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;

        // Parse the token to set the expiration time
        if (user.accessToken) {
          try {
            const decoded = jwtDecode(user.accessToken) as any;
            token.accessTokenExpires = decoded.exp * 1000;
          } catch (error) {
            console.error("Failed to decode accessToken", error);
          }
        }
      }

      // If token is still valid, return it
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // If token has expired, refresh it
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
  secret: config.next_auth_secret,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: config.NODE_ENV === "production"
      }
    }
  }
};
