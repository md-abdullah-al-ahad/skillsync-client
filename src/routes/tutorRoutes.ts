import { LayoutDashboard, CalendarDays, Clock, User } from "lucide-react";
import { Route } from "@/types";

export const tutorRoutes: Route[] = [
  {
    title: "Tutor Menu",
    items: [
      {
        title: "Dashboard",
        url: "/tutor-dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Sessions",
        url: "/tutor-dashboard/sessions",
        icon: CalendarDays,
      },
      {
        title: "Availability",
        url: "/tutor-dashboard/availability",
        icon: Clock,
      },
      {
        title: "Profile",
        url: "/tutor-dashboard/profile",
        icon: User,
      },
    ],
  },
];
