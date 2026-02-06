import { User } from "./user.type";

export interface TutorProfile {
  id: string;
  userId: string;
  bio?: string | null;
  hourlyRate?: number | null;
  experience?: number | null;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;

  // Relations (populated)
  user?: User;
  categories?: Category[];
  availabilitySlots?: AvailabilitySlot[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface AvailabilitySlot {
  id: string;
  tutorProfileId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TutorFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
}
