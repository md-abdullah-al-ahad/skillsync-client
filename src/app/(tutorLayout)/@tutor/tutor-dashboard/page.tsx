import type { Metadata } from "next";
import TutorDashboardClient from "./TutorDashboardClient";

export const metadata: Metadata = {
  title: "Tutor Dashboard | SkillSync",
  description: "Manage your tutoring sessions and track your performance",
};

export default function TutorDashboardPage() {
  return <TutorDashboardClient />;
}
