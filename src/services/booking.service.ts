const getBookingsApiUrl = () => {
  if (typeof window !== "undefined") {
    return "/api/bookings";
  }

  const backendBase =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

  return `${backendBase}/bookings`;
};

const parseErrorMessage = (payload: unknown, fallback: string) => {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: string }).message;
    if (message) return message;
  }
  return fallback;
};

const ensureArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

export const bookingService = {
  // POST /api/bookings
  createBooking: async (data: {
    tutorProfileId: string;
    startTime: string; // ISO datetime
    endTime: string; // ISO datetime
    price: number;
  }) => {
    try {
      const res = await fetch(`${getBookingsApiUrl()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || result?.success === false) {
        return {
          data: null,
          error: {
            message: parseErrorMessage(result, "Failed to create booking"),
          },
        };
      }

      return { data: result?.data ?? result, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to create booking" } };
    }
  },

  // GET /api/bookings
  getBookings: async (filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      let url = `${getBookingsApiUrl()}`;
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

      if (!res.ok || result?.success === false) {
        return {
          data: [],
          error: {
            message: parseErrorMessage(result, "Failed to fetch bookings"),
          },
        };
      }

      return {
        data: ensureArray(result?.data ?? result),
        pagination: result?.pagination,
        error: null,
      };
    } catch (err) {
      return { data: [], error: { message: "Failed to fetch bookings" } };
    }
  },

  // GET /api/bookings/:id
  getBookingById: async (id: string) => {
    try {
      const res = await fetch(`${getBookingsApiUrl()}/${id}`, {
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok || result?.success === false) {
        return {
          data: null,
          error: {
            message: parseErrorMessage(result, "Failed to fetch booking"),
          },
        };
      }

      return { data: result?.data ?? result, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch booking" } };
    }
  },

  // PATCH /api/bookings/:id (Tutor only)
  completeBooking: async (id: string) => {
    try {
      const res = await fetch(`${getBookingsApiUrl()}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      const result = await res.json();

      if (!res.ok || result?.success === false) {
        return {
          data: null,
          error: {
            message: parseErrorMessage(result, "Failed to complete booking"),
          },
        };
      }

      return { data: result?.data ?? result, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to complete booking" } };
    }
  },

  // PATCH /api/bookings/:id
  cancelBooking: async (id: string) => {
    try {
      const res = await fetch(`${getBookingsApiUrl()}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      const result = await res.json();

      if (!res.ok || result?.success === false) {
        return {
          data: null,
          error: {
            message: parseErrorMessage(result, "Failed to cancel booking"),
          },
        };
      }

      return { data: result?.data ?? result, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to cancel booking" } };
    }
  },
};
