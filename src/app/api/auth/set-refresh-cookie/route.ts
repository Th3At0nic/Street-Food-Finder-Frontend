import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { refreshToken } = await req.json();
  console.log({ refreshTokenSet: refreshToken });
  if (!refreshToken) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  (await cookies()).set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });

  return NextResponse.json({ success: true });
}
