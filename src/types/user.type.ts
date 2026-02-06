export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  session?: any;
}

export interface Session {
  user: User;
  session: any;
}
