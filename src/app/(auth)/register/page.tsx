import type { Metadata } from "next";
import RegisterForm from "@/components/modules/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign Up - SkillSync",
  description: "Create your SkillSync account",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
