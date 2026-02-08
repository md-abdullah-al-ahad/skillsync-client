import { User } from "@/types";

const getUserApiUrl = () => {
  if (typeof window !== "undefined") {
    return "/api/user";
  }

  const backendBase =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

  return `${backendBase}/user`;
};

export const userService = {
  // GET /api/user/me
  getCurrentUserProfile: async () => {
    try {
      const res = await fetch(`${getUserApiUrl()}/me`, {
        credentials: "include",
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch profile" } };
    }
  },

  // PUT /api/user/profile
  updateProfile: async (userData: Partial<User>) => {
    try {
      const res = await fetch(`${getUserApiUrl()}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to update profile" } };
    }
  },
};
