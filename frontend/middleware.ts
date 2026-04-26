import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Read cookie "access_token" from request.cookies.get("access_token")
  const token = request.cookies.get("access_token")?.value;

  // Get pathname from request.nextUrl.pathname
  const pathname = request.nextUrl.pathname;

  // If no token AND pathname starts with "/dashboard": redirect to /signin
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If token exists AND (pathname === "/signin" OR pathname === "/signup"): redirect to /dashboard
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Otherwise: return NextResponse.next()
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
