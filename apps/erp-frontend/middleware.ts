import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ponytail: same fallback as lib/session.ts — both must match or cookie verification fails
const encodedKey = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "open-erp-session-secret"
);

const protectedRoutes = ["/"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(route + "/")
  );
  const isPublicRoute = publicRoutes.includes(path);

  let session = null;

  const cookie = req.cookies.get("session")?.value;
  if (cookie) {
    try {
      const { payload } = await jwtVerify(cookie, encodedKey, {
        algorithms: ["HS256"],
      });
      session = payload;
    } catch {
      // Invalid token — treat as unauthenticated
    }
  }

  // Redirect to /login if not authenticated on protected route
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to / if authenticated on public route
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)"],
};
