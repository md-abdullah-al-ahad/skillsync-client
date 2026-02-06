const AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000/api/auth";

export const authService = {
  // POST /api/auth/sign-up/email
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: "STUDENT" | "TUTOR";
  }) => {
    try {
      const res = await fetch(`${AUTH_URL}/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        return { data: null, error };
      }

      return { data: await res.json(), error: null };
    } catch (err) {
      return { data: null, error: { message: "Registration failed" } };
    }
  },

  // POST /api/auth/sign-in/email
  login: async (credentials: { email: string; password: string }) => {
    try {
      const res = await fetch(`${AUTH_URL}/sign-in/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        return { data: null, error };
      }

      return { data: await res.json(), error: null };
    } catch (err) {
      return { data: null, error: { message: "Login failed" } };
    }
  },

  // GET /api/auth/get-session
  getCurrentUser: async () => {
    try {
      const res = await fetch(`${AUTH_URL}/get-session`, {
        credentials: "include",
      });

      if (!res.ok) return { data: null, error: null };

      return { data: await res.json(), error: null };
    } catch (err) {
      return { data: null, error: null };
    }
  },

  // POST /api/auth/sign-out
  logout: async () => {
    try {
      await fetch(`${AUTH_URL}/sign-out`, {
        method: "POST",
        credentials: "include",
      });
      return { data: true, error: null };
    } catch (err) {
      return { data: null, error: { message: "Logout failed" } };
    }
  },
};
