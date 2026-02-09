"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const extractUser = (payload: unknown): User | null => {
    if (!payload || typeof payload !== "object") return null;
    const maybePayload = payload as {
      user?: User;
      data?: User;
    };
    if (maybePayload.user) return maybePayload.user;
    if (maybePayload.data) return maybePayload.data;
    if ("role" in maybePayload) return maybePayload as User;
    return null;
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const profileResult = await userService.getCurrentUserProfile();
      const profileUser = extractUser(profileResult.data);
      if (profileUser) {
        setUser(profileUser);
        return;
      }

      const sessionResult = await authService.getCurrentUser();
      const sessionUser = extractUser(sessionResult.data);
      if (sessionUser) {
        setUser(sessionUser);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const { data, error } = await authService.login(credentials);

    if (error) {
      return { success: false, error };
    }

    const sessionUser = extractUser(data);
    if (sessionUser) {
      setUser(sessionUser);
    }

    return { success: true, data };
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: "STUDENT" | "TUTOR";
  }) => {
    const result = await authService.register(data);

    if (result.error) {
      return { success: false, error: result.error };
    }

    const sessionUser = extractUser(result.data);
    if (sessionUser) {
      setUser(sessionUser);
    }

    return { success: true, data: result.data };
  };

  const logout = async (redirectTo: string = "/login") => {
    await authService.logout();
    // Clear role cookie used by middleware for role-based access control
    document.cookie = "user-role=; path=/; max-age=0";
    setUser(null);
    router.replace(redirectTo);
    router.refresh();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };
}
