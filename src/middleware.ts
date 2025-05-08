import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import localConfig from "./config";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: localConfig.next_auth_secret });

  // Check if the route is protected
  const isProtectedRoute = ["/admin", "/user/dashboard", "/subscription/verify"].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check specific role restrictions (for admin routes)
  if (request.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

//protected routes
export const config = {
  matcher: ["/admin/:path*", "/user/dashboard/:path*", "/subscription/verify"]
};
