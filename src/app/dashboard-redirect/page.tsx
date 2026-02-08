import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerUserRole } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export default async function DashboardRedirectPage() {
  const role = await getServerUserRole();
  if (!role) {
    redirect("/login");
  }

  // Store the user role in a cookie so middleware can enforce role-based access
  const cookieStore = await cookies();
  cookieStore.set("user-role", role, {
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  switch (role) {
    case "ADMIN":
      redirect("/admin-dashboard");
    case "TUTOR":
      redirect("/tutor-dashboard");
    case "STUDENT":
    default:
      redirect("/dashboard");
  }
}
