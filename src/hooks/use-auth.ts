"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const { data } = await authService.getCurrentUser();
      if (data?.user) {
        setUser(data.user);
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

    if (data?.user) {
      setUser(data.user);
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

    if (result.data?.user) {
      setUser(result.data.user);
    }

    return { success: true, data: result.data };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
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
