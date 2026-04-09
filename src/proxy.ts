import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes — must be authenticated
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // NextAuth v5 uses "authjs.session-token" (or __Secure- prefix in prod)
    const sessionToken =
      request.cookies.get("authjs.session-token") ||
      request.cookies.get("__Secure-authjs.session-token");

    if (!isLoginPage && !sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Already logged in — skip the login page
    if (isLoginPage && sessionToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};

