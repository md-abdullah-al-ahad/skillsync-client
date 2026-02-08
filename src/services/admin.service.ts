const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const normalizeArray = <T,>(payload: unknown): T[] => {
  if (Array.isArray((payload as { data?: unknown })?.data)) {
    return (payload as { data: T[] }).data;
  }
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  return [];
};

export const adminService = {
  // GET /api/admin/users (with optional filters)
  getAllUsers: async (filters?: {
    role?: string;
    status?: string;
    search?: string;
  }) => {
    try {
      const url = new URL(`${API_URL}/admin/users`);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });
      }

      const res = await fetch(url.toString(), {
        credentials: "include",
      });

      const result = await res.json();
      return {
        data: normalizeArray(result),
        pagination: result?.pagination,
        error: null,
      };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch users" } };
    }
  },

  // PATCH /api/admin/users/:id (set status to BANNED)
  banUser: async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "BANNED" }),
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to ban user" } };
    }
  },

  // PATCH /api/admin/users/:id (set status to ACTIVE)
  unbanUser: async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "ACTIVE" }),
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to unban user" } };
    }
  },

  // GET /api/admin/bookings
  getAllBookings: async () => {
    try {
      const res = await fetch(`${API_URL}/admin/bookings`, {
        credentials: "include",
      });

      const result = await res.json();
      return {
        data: normalizeArray(result),
        pagination: result?.pagination,
        error: null,
      };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch bookings" } };
    }
  },

  // GET /api/categories
  getCategories: async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const result = await res.json();
      return { data: normalizeArray(result), error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch categories" } };
    }
  },

  // Alias for getCategories
  getAllCategories: async () => {
    return adminService.getCategories();
  },

  // POST /api/categories (Admin only)
  createCategory: async (categoryData: { name: string; slug: string }) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categoryData),
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to create category" } };
    }
  },

  // DELETE /api/categories/:id (Admin only)
  deleteCategory: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to delete category" } };
    }
  },
};
