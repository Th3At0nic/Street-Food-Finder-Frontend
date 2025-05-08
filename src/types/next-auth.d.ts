// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import { TRole } from "./user.types";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: TRole;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string | null;
  }
}
