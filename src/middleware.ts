import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import localConfig from "./config";
import { UserRole } from "./types";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: localConfig.next_auth_secret as string,
    secureCookie: localConfig.NODE_ENV === "production"
  });
 
  // Protected routes
  const protectedRoutes = ["/admin", "/user/dashboard", "/subscription/verify"];

  const isProtectedRoute = protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path));

  // Redirect to login if protected route and no token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith("/admin") && token?.role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // User route protection
  if (
    request.nextUrl.pathname.startsWith("/user") &&
    token?.role !== UserRole.USER &&
    token?.role !== UserRole.PREMIUM_USER
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/dashboard/:path*", "/subscription/verify"]
};
