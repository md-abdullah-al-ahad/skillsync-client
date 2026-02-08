"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const getFieldError = (errors: unknown[] | undefined) => {
    const err = errors?.[0] as any;
    if (!err) return null;
    if (typeof err === "string") return err;
    if (typeof err === "object" && typeof err.message === "string") {
      return err.message;
    }
    return null;
  };
  const normalizeAuthResult = (result: unknown) => {
    if (!result || typeof result !== "object") {
      return { data: null, error: "No response from server" };
    }

    const maybeResult = result as { data?: unknown; error?: unknown };
    if ("data" in maybeResult || "error" in maybeResult) {
      return { data: maybeResult.data, error: maybeResult.error };
    }

    return { data: result, error: null };
  };
  const getAuthErrorMessage = (error: unknown, fallback: string) => {
    if (!error) return fallback;
    if (typeof error === "string") return error;
    if (typeof error === "object" && "message" in error) {
      const message = (error as { message?: string }).message;
      if (message) return message;
    }
    return fallback;
  };
  const getRedirectPath = (role?: string) => {
    switch (role) {
      case "TUTOR":
        return "/tutor-dashboard";
      case "ADMIN":
        return "/admin-dashboard";
      case "STUDENT":
      default:
        return "/dashboard";
    }
  };
  const extractRole = (payload: unknown) => {
    if (!payload || typeof payload !== "object") return undefined;
    const data = payload as {
      user?: { role?: string };
      session?: { user?: { role?: string } };
    };
    return data.user?.role || data.session?.user?.role;
  };
  const getRoleFromSession = async () => {
    try {
      const sessionResult = await authClient.getSession();
      const sessionPayload = normalizeAuthResult(sessionResult);
      return extractRole(sessionPayload.data);
    } catch {
      return undefined;
    }
  };
  const getRoleFromProfile = async () => {
    try {
      const profileResult = await userService.getCurrentUserProfile();
      const profilePayload = profileResult.data as unknown;
      if (!profilePayload || typeof profilePayload !== "object") {
        return undefined;
      }
      const maybePayload = profilePayload as { data?: { role?: string } };
      const profile = "data" in maybePayload ? maybePayload.data : maybePayload;
      return (profile as { role?: string } | undefined)?.role;
    } catch {
      return undefined;
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const result = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });
        const { data, error } = normalizeAuthResult(result);

        if (error) {
          toast.error(getAuthErrorMessage(error, "Login failed."));
          return;
        }

        const payload = data as {
          user?: { id?: string; role?: string };
          redirect?: boolean;
          url?: string;
        };

        let userRole = payload?.user?.role;
        if (!userRole) {
          userRole = (await getRoleFromSession()) || (await getRoleFromProfile());
        }

        toast.success("Successfully logged in!");
        window.location.href = getRedirectPath(userRole);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Google sign-in failed";
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Email Field */}
          <form.Field
            name="email"
            validators={{
              onChange: loginSchema.shape.email,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  type="email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={isLoading}
                />
                {getFieldError(field.state.meta.errors) ? (
                  <p className="text-sm text-destructive">
                    {getFieldError(field.state.meta.errors)}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Password Field */}
          <form.Field
            name="password"
            validators={{
              onChange: loginSchema.shape.password,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={isLoading}
                />
                {getFieldError(field.state.meta.errors) ? (
                  <p className="text-sm text-destructive">
                    {getFieldError(field.state.meta.errors)}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="currentColor"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="currentColor"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="currentColor"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="currentColor"
              />
            </svg>
            Sign in with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
