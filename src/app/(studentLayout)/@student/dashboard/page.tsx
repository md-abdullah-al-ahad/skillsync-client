import type { Metadata } from "next";
import StudentDashboardClient from "./StudentDashboardClient";

export const metadata: Metadata = {
  title: "Student Dashboard | SkillSync",
  description: "Manage your bookings and learning journey",
};

export default function StudentDashboardPage() {
  return <StudentDashboardClient />;
}
