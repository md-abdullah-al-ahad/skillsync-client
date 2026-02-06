import type { Metadata } from "next";
import LoginForm from "@/components/modules/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login - SkillSync",
  description: "Sign in to your SkillSync account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
