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
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // TODO: Add role-based access control
  // This would require decoding the session token or making an API call
  // to verify the user's role matches the route they're trying to access
  // Example:
  // - Students can only access /dashboard
  // - Tutors can only access /tutor-dashboard
  // - Admins can only access /admin-dashboard

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
