import { redirect } from "next/navigation";
import TutorShell from "@/components/layout/TutorShell";
import { getRoleRedirectPath } from "@/lib/server-auth";

export default async function TutorLayout({
  children,
  tutor,
}: {
  children: React.ReactNode;
  tutor: React.ReactNode;
}) {
  const redirectPath = await getRoleRedirectPath("TUTOR");
  if (redirectPath) {
    redirect(redirectPath);
  }

  return <TutorShell>{tutor || children}</TutorShell>;
}
