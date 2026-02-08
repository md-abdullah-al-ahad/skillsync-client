import { Suspense } from "react";
import type { Metadata } from "next";
import VerifyEmailClient from "@/components/modules/auth/VerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Email - SkillSync",
  description: "Verify your SkillSync account email",
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="flex min-h-[70vh] items-center justify-center py-16">
            <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-card/80 p-6 text-sm text-muted-foreground">
              Verifying your email...
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
