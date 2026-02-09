const getAdminApiUrl = () => {
  if (typeof window !== "undefined") {
    return "/api/admin";
  }

  const backendBase =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

  return `${backendBase}/admin`;
};

const normalizeArray = <T>(payload: unknown): T[] => {
  if (Array.isArray((payload as { data?: unknown })?.data)) {
    return (payload as { data: T[] }).data;
  }
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  return [];
};

export const adminService = {
  // GET /api/admin/stats
  getStats: async () => {
    try {
      const res = await fetch(`${getAdminApiUrl()}/stats`, {
        credentials: "include",
      });

      const result = await res.json();
      return { data: result?.data ?? result, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch stats" } };
    }
  },

  // GET /api/admin/users (with optional filters)
  getAllUsers: async (filters?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      let url = `${getAdminApiUrl()}/users`;
      if (filters) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        const query = params.toString();
        if (query) {
          url = `${url}?${query}`;
        }
      }

      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
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
      const res = await fetch(`${getAdminApiUrl()}/users/${userId}`, {
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
      const res = await fetch(`${getAdminApiUrl()}/users/${userId}`, {
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
  getAllBookings: async (filters?: { status?: string; page?: number; limit?: number }) => {
    try {
      let url = `${getAdminApiUrl()}/bookings`;
      if (filters) {
        const params = new URLSearchParams();
        if (filters.status) params.append("status", filters.status);
        if (typeof filters.page === "number") {
          params.append("page", String(filters.page));
        }
        if (typeof filters.limit === "number") {
          params.append("limit", String(filters.limit));
        }
        const query = params.toString();
        if (query) {
          url = `${url}?${query}`;
        }
      }

      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
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
      const url =
        typeof window !== "undefined"
          ? "/api/categories"
          : `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/categories`;
      const res = await fetch(url, { credentials: "include" });
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
      const url =
        typeof window !== "undefined"
          ? "/api/categories"
          : `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/categories`;
      const res = await fetch(url, {
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

  // PUT /api/categories/:id (Admin only)
  updateCategory: async (
    id: string,
    categoryData: { name?: string; slug?: string },
  ) => {
    try {
      const url =
        typeof window !== "undefined"
          ? `/api/categories/${id}`
          : `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/categories/${id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categoryData),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message || "Failed to update category" },
        };
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to update category" } };
    }
  },

  // DELETE /api/categories/:id (Admin only)
  deleteCategory: async (id: string) => {
    try {
      const url =
        typeof window !== "undefined"
          ? `/api/categories/${id}`
          : `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/categories/${id}`;
      const res = await fetch(url, {
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
