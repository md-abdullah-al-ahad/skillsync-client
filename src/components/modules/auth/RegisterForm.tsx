"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "TUTOR"], {
    message: "Please select a role",
  }),
});

export default function RegisterForm() {
  const router = useRouter();
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

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT" as "STUDENT" | "TUTOR",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const result = await (authClient.signUp.email as any)(
          {
            name: value.name,
            email: value.email,
            password: value.password,
            role: value.role,
          },
          {
            onSuccess: async () => {
              // Store role in user metadata or make additional API call
              // Example: await fetch('/api/users/update-role', { method: 'POST', body: JSON.stringify({ role: value.role }) });
            },
          },
        );
        const { data, error } = normalizeAuthResult(result);

        if (error) {
          toast.error(getAuthErrorMessage(error, "Registration failed."));
          return;
        }

        const payload = data as { user?: { id?: string } };

        if (!payload?.user) {
          toast.error("Registration failed. Please try again.");
          return;
        }

        toast.success(
          "Account created successfully! Please verify your email before signing in.",
        );
        router.push("/login");
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Sign up to get started with SkillSync</CardDescription>
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
          {/* Name Field */}
          <form.Field
            name="name"
            validators={{
              onChange: registerSchema.shape.name,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Full Name</Label>
                <Input
                  id={field.name}
                  type="text"
                  placeholder="John Doe"
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

          {/* Email Field */}
          <form.Field
            name="email"
            validators={{
              onChange: registerSchema.shape.email,
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
              onChange: registerSchema.shape.password,
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

          {/* Role Field */}
          <form.Field
            name="role"
            validators={{
              onChange: registerSchema.shape.role,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>I want to</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "STUDENT" | "TUTOR")
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Learn as a Student</SelectItem>
                    <SelectItem value="TUTOR">Teach as a Tutor</SelectItem>
                  </SelectContent>
                </Select>
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
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
