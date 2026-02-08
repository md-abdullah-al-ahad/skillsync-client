"use server";

import { bookingService } from "@/services/booking.service";

export async function createBookingAction(data: {
  tutorProfileId: string;
  startTime: string;
  endTime: string;
  price: number;
}) {
  try {
    const result = await bookingService.createBooking(data);

    if (result.error) {
      return {
        success: false,
        error: result.error.message || "Failed to create booking",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred while creating the booking",
    };
  }
}
