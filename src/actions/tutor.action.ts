"use server";

import { tutorService } from "@/services/tutor.service";

export async function getTutorsAction(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}) {
  try {
    const result = await tutorService.getTutors(filters);

    if (result.error) {
      return {
        success: false,
        error: result.error.message || "Failed to fetch tutors",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred while fetching tutors",
    };
  }
}
