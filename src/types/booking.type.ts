import { User } from './user.type';
import { TutorProfile } from './tutor.type';

export type BookingStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  studentId: string;
  tutorProfileId: string;
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime
  price: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  
  // Relations (populated)
  student?: User;
  tutorProfile?: TutorProfile;
}
