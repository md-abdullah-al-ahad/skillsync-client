import { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const userService = {
  // GET /api/user/me
  getCurrentUserProfile: async () => {
    try {
      const res = await fetch(`${API_URL}/user/me`, {
        credentials: 'include'
      });
      
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Failed to fetch profile' } };
    }
  },

  // PATCH /api/user/me
  updateProfile: async (userData: Partial<User>) => {
    try {
      const res = await fetch(`${API_URL}/user/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      });
      
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Failed to update profile' } };
    }
  }
};
