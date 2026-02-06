import { User } from "./user.type";
import { Booking } from "./booking.type";

export interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  tutorProfileId: string;
  rating: number; // 1-5
  comment?: string | null;
  createdAt: string;

  // Relations (populated)
  student?: User;
  booking?: Booking;
}
