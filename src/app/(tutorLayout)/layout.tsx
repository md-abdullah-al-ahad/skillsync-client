import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import TutorShell from "@/components/layout/TutorShell";

export default async function TutorLayout({
  children,
  tutor,
}: {
  children: React.ReactNode;
  tutor: React.ReactNode;
}) {
  // Check authentication
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get("better-auth.session_token") ??
    cookieStore.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    redirect("/login");
  }

  // TODO: Verify user role is TUTOR
  // This should be done via an API call or session verification

  return <TutorShell>{tutor || children}</TutorShell>;
}
