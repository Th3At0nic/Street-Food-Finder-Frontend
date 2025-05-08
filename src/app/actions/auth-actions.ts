"use server";

import { cookies } from "next/headers";

export async function setRefreshTokenCookie(refreshToken: string) {
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  (await cookies()).set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/"
  });

  return { success: true };
}

export async function getRefreshTokenCookie() {
  return (await cookies()).get("refreshToken")?.value;
}
