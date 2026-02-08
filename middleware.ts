import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookies
  const sessionToken =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");
  const isAuthenticated = !!sessionToken;

  // Define protected routes
  const isStudentRoute = pathname.startsWith("/dashboard");
  const isTutorRoute = pathname.startsWith("/tutor-dashboard");
  const isAdminRoute = pathname.startsWith("/admin-dashboard");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && (isStudentRoute || isTutorRoute || isAdminRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard-redirect", request.url));
  }

  // Role-based access control using cookie-stored role
  // The role is set after login via /dashboard-redirect and stored in a cookie
  const userRole = request.cookies.get("user-role")?.value;

  if (isAuthenticated && userRole) {
    // Students should only access /dashboard routes
    if (isTutorRoute && userRole !== "TUTOR") {
      const redirectPath =
        userRole === "ADMIN" ? "/admin-dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Tutors should only access /tutor-dashboard routes
    if (isStudentRoute && userRole !== "STUDENT") {
      const redirectPath =
        userRole === "ADMIN" ? "/admin-dashboard" : "/tutor-dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Admins should only access /admin-dashboard routes
    if (isAdminRoute && userRole !== "ADMIN") {
      const redirectPath =
        userRole === "TUTOR" ? "/tutor-dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
