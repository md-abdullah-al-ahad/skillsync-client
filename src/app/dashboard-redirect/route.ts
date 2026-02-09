import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get("better-auth.session_token") ??
    cookieStore.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const url = new URL(request.url);
    const apiUrl = `${url.origin}/api/user/me`;

    const response = await fetch(apiUrl, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const data = await response.json();
    const user = data?.data ?? data?.user ?? data;
    const role = user?.role as string | undefined;

    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Determine redirect path based on role
    let redirectPath: string;
    switch (role) {
      case "ADMIN":
        redirectPath = "/admin-dashboard";
        break;
      case "TUTOR":
        redirectPath = "/tutor-dashboard";
        break;
      case "STUDENT":
      default:
        redirectPath = "/dashboard";
    }

    const redirectResponse = NextResponse.redirect(
      new URL(redirectPath, request.url),
    );

    // Route Handlers CAN set cookies (unlike Server Components)
    redirectResponse.cookies.set("user-role", role, {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return redirectResponse;
  } catch (error) {
    console.error("Dashboard redirect error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
