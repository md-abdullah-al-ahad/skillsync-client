import { cookies, headers } from "next/headers";

export type ServerUserRole = "STUDENT" | "TUTOR" | "ADMIN";

const getDashboardPath = (role: ServerUserRole) => {
  switch (role) {
    case "TUTOR":
      return "/tutor-dashboard";
    case "ADMIN":
      return "/admin-dashboard";
    case "STUDENT":
    default:
      return "/dashboard";
  }
};

const getUserApiUrl = async () => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const origin = host ? `${protocol}://${host}` : null;

  if (origin) {
    return `${origin}/api/user/me`;
  }

  const fallbackBase =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

  return `${fallbackBase}/user/me`;
};

export const getServerUserRole = async () => {
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get("better-auth.session_token") ??
    cookieStore.get("__Secure-better-auth.session_token");

  if (!sessionCookie) return null;

  try {
    const url = await getUserApiUrl();
    const response = await fetch(url, {
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) return null;
    const data = await response.json();
    const user = data?.data ?? data?.user ?? data;
    return (user?.role as ServerUserRole | undefined) ?? null;
  } catch {
    return null;
  }
};

export const getRoleRedirectPath = async (
  expectedRole: ServerUserRole,
): Promise<string | null> => {
  const role = await getServerUserRole();
  if (!role) return "/login";
  if (role !== expectedRole) return getDashboardPath(role);
  return null;
};
