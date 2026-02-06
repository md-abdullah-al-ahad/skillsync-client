const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const bookingService = {
  // POST /api/bookings
  createBooking: async (data: {
    tutorProfileId: string;
    startTime: string; // ISO datetime
    endTime: string;   // ISO datetime
    price: number;
  }) => {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Failed to create booking' } };
    }
  },

  // GET /api/bookings
  getBookings: async () => {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        credentials: 'include'
      });
      
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Failed to fetch bookings' } };
    }
  },

  // GET /api/bookings/:id
  getBookingById: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        credentials: 'include'
      });
      
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Failed to fetch booking' } };
    }
  },

  // PATCH /api/bookings/:id/complete (Tutor only)
  completeBooking: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/complete`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Failed to complete booking' } };
    }
  },

  // PATCH /api/bookings/:id/cancel
  cancelBooking: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Failed to cancel booking' } };
    }
  }
};
