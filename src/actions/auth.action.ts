"use server";

import { authService } from "@/services/auth.service";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TUTOR";
}) {
  try {
    const result = await authService.register(data);

    if (result.error) {
      return {
        success: false,
        error: result.error.message || "Registration failed",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred during registration",
    };
  }
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    const result = await authService.login(credentials);

    if (result.error) {
      return {
        success: false,
        error: result.error.message || "Login failed",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred during login",
    };
  }
}

// Legacy exports for compatibility
export async function loginAction() {
  return loginUser;
}

export async function registerAction() {
  return registerUser;
}
