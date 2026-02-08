const getReviewsApiUrl = () => {
  if (typeof window !== "undefined") {
    return "/api/reviews";
  }

  const backendBase =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

  return `${backendBase}/reviews`;
};

export const reviewService = {
  // POST /api/reviews
  createReview: async (data: {
    bookingId: string;
    rating: number; // 1-5
    comment?: string;
  }) => {
    try {
      const res = await fetch(`${getReviewsApiUrl()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to create review" } };
    }
  },

  // GET /api/reviews/tutor/:tutorId
  getReviewsByTutor: async (tutorId: string) => {
    try {
      const res = await fetch(`${getReviewsApiUrl()}/tutor/${tutorId}`);
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Failed to fetch reviews" } };
    }
  },
};
