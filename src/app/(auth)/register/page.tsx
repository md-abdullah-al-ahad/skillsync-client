import type { Metadata } from "next";
import RegisterForm from "@/components/modules/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign Up - SkillSync",
  description: "Create your SkillSync account",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <div className="flex min-h-[70vh] items-center justify-center py-16">
        <RegisterForm />
      </div>
    </div>
  );
}
