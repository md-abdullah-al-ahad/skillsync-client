import { LayoutDashboard, Calendar, User } from "lucide-react";
import { Route } from "@/types";

export const studentRoutes: Route[] = [
  {
    title: "Student Menu",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Bookings",
        url: "/dashboard/bookings",
        icon: Calendar,
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
      },
    ],
  },
];
