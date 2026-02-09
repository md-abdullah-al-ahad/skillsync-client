const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getTutorApiUrl = () => {
  if (typeof window !== "undefined") {
    return "/api/tutor";
  }

  const backendBase =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

  return `${backendBase}/tutor`;
};

export const tutorService = {
  // GET /api/tutors (with query params: category, minPrice, maxPrice, minRating, search)
  getTutors: async (
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
      search?: string;
    },
    options?: { cache?: RequestCache; revalidate?: number },
  ) => {
    try {
      const url = new URL(`${API_URL}/tutors`);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const config: RequestInit = {};
      if (options?.cache) config.cache = options.cache;
      if (options?.revalidate) config.next = { revalidate: options.revalidate };

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch tutors" } };
    }
  },

  // GET /api/tutors/:id
  getTutorById: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/tutors/${id}`);
      const result = await res.json();

      if (!res.ok || result?.success === false) {
        return {
          data: null,
          error: { message: result?.message || "Failed to fetch tutor" },
        };
      }

      return { data: result?.data ?? result, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch tutor" } };
    }
  },

  // GET /api/tutors?featured=true (example - adjust based on your backend)
  getFeaturedTutors: async () => {
    try {
      const res = await fetch(`${API_URL}/tutors?limit=6`);
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: "Failed to fetch featured tutors" },
      };
    }
  },

  // PUT /api/tutor/profile
  updateTutorProfile: async (data: any) => {
    try {
      const res = await fetch(`${getTutorApiUrl()}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to update profile" } };
    }
  },

  // POST /api/tutor/availability
  addAvailability: async (slot: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }) => {
    try {
      const res = await fetch(`${getTutorApiUrl()}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(slot),
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to add availability" } };
    }
  },

  // GET /api/tutor/availability
  getAvailability: async () => {
    try {
      const res = await fetch(`${getTutorApiUrl()}/availability`, {
        credentials: "include",
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch availability" } };
    }
  },

  // DELETE /api/tutor/availability/:id
  deleteAvailability: async (id: string) => {
    try {
      const res = await fetch(`${getTutorApiUrl()}/availability/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: "Failed to delete availability" },
      };
    }
  },
};
