import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import StudentShell from "@/components/layout/StudentShell";

export default async function StudentLayout({
  children,
  student,
}: {
  children: React.ReactNode;
  student: React.ReactNode;
}) {
  // Check authentication
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get("better-auth.session_token") ??
    cookieStore.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    redirect("/login");
  }

  // TODO: Verify user role is STUDENT
  // This should be done via an API call or session verification

  return <StudentShell>{student || children}</StudentShell>;
}
