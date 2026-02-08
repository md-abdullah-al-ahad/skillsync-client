"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type VerifyStatus = "idle" | "loading" | "success" | "error";

const DEFAULT_ERROR = "Verification failed. Please request a new link.";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    let isActive = true;

    const verify = async () => {
      setStatus("loading");
      try {
        const res = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
          },
        );

        if (!isActive) return;

        const contentType = res.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        const payload = isJson ? await res.json() : null;

        if (!res.ok) {
          const errorMessage =
            (payload && (payload.message as string)) || DEFAULT_ERROR;
          setStatus("error");
          setMessage(errorMessage);
          return;
        }

        setStatus("success");
        setMessage("Your email has been verified. You can sign in now.");
      } catch (error) {
        if (!isActive) return;
        setStatus("error");
        setMessage(DEFAULT_ERROR);
      }
    };

    verify();

    return () => {
      isActive = false;
    };
  }, [token]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <div className="flex min-h-[70vh] items-center justify-center py-16">
        <Card className="w-full max-w-lg border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {status === "loading" && <p>Verifying your email...</p>}
            {status === "success" && (
              <p className="text-emerald-700">{message}</p>
            )}
            {status === "error" && (
              <p className="text-rose-700">{message || DEFAULT_ERROR}</p>
            )}
            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Button asChild>
                <Link href="/login?verified=1">Go to Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Create new account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
