import { redirect } from "next/navigation";
import StudentShell from "@/components/layout/StudentShell";
import { getRoleRedirectPath } from "@/lib/server-auth";

export default async function StudentLayout({
  children,
  student,
}: {
  children: React.ReactNode;
  student: React.ReactNode;
}) {
  const redirectPath = await getRoleRedirectPath("STUDENT");
  if (redirectPath) {
    redirect(redirectPath);
  }

  return <StudentShell>{student || children}</StudentShell>;
}
