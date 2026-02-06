import { LayoutDashboard, Users, Calendar, FolderOpen } from "lucide-react";
import { Route } from "@/types";

export const adminRoutes: Route[] = [
  {
    title: "Admin Menu",
    items: [
      {
        title: "Dashboard",
        url: "/admin-dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        url: "/admin-dashboard/users",
        icon: Users,
      },
      {
        title: "Bookings",
        url: "/admin-dashboard/bookings",
        icon: Calendar,
      },
      {
        title: "Categories",
        url: "/admin-dashboard/categories",
        icon: FolderOpen,
      },
    ],
  },
];
