import type { Metadata } from "next";
import LoginForm from "@/components/modules/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login - SkillSync",
  description: "Sign in to your SkillSync account",
};

interface LoginPageProps {
  searchParams?: {
    verified?: string;
    error?: string;
  };
}

const verificationMessages: Record<string, string> = {
  token_expired: "Verification link expired. Please request a new one.",
  invalid_token: "Invalid verification link. Please request a new one.",
  user_not_found: "Verification failed. Please sign up again.",
  unauthorized: "Verification failed. Please try again.",
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const verified =
    searchParams?.verified === "1" || searchParams?.verified === "true";
  const errorKey = searchParams?.error || "";
  const errorMessage = verificationMessages[errorKey];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-16">
        {(verified || errorMessage) && (
          <div
            className={`w-full max-w-md rounded-2xl border px-4 py-3 text-sm ${
              verified
                ? "border-emerald-200 bg-emerald-50/80 text-emerald-800"
                : "border-rose-200 bg-rose-50/80 text-rose-700"
            }`}
          >
            {verified
              ? "Your email has been verified. You can sign in now."
              : errorMessage}
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
