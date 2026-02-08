"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  UserPlus,
  FolderOpen,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { adminService } from "@/services/admin.service";
import type { User, Booking } from "@/types";

const normalizeArray = <T,>(input: unknown): T[] => {
  if (Array.isArray((input as { data?: unknown })?.data)) {
    return (input as { data: T[] }).data;
  }
  if (Array.isArray(input)) {
    return input as T[];
  }
  return [];
};

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [usersResponse, bookingsResponse] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllBookings(),
      ]);

      setUsers(normalizeArray<User>(usersResponse.data));
      setBookings(normalizeArray<Booking>(bookingsResponse.data));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const safeUsers = normalizeArray<User>(users);
  const safeBookings = normalizeArray<Booking>(bookings);

  // Calculate stats
  const totalUsers = safeUsers.length;
  const totalTutors = safeUsers.filter((u) => u.role === "TUTOR").length;
  const totalStudents = safeUsers.filter((u) => u.role === "STUDENT").length;
  const totalBookings = safeBookings.length;
  const confirmedBookings = safeBookings.filter(
    (b) => b.status === "CONFIRMED",
  ).length;
  const completedBookings = safeBookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;
  const totalRevenue = safeBookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.price, 0);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: `${totalStudents} students, ${totalTutors} tutors`,
      href: "/admin-dashboard/users",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      description: `${confirmedBookings} confirmed, ${completedBookings} completed`,
      href: "/admin-dashboard/bookings",
    },
    {
      title: "Platform Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "From completed bookings",
      href: "/admin-dashboard/bookings",
    },
    {
      title: "Active Sessions",
      value: confirmedBookings,
      icon: TrendingUp,
      description: "Upcoming confirmed bookings",
      href: "/admin-dashboard/bookings",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all platform users",
      icon: Users,
      href: "/admin-dashboard/users",
    },
    {
      title: "View Bookings",
      description: "Monitor all tutoring sessions",
      icon: Calendar,
      href: "/admin-dashboard/bookings",
    },
    {
      title: "Manage Categories",
      description: "Add or edit subject categories",
      icon: FolderOpen,
      href: "/admin-dashboard/categories",
    },
    {
      title: "Platform Settings",
      description: "Configure platform settings",
      icon: Settings,
      href: "/admin-dashboard/settings",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage the tutoring platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <div className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div className="rounded-lg bg-muted p-2">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeBookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">
                    Booking #{booking.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {booking.status} • ${booking.price}
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin-dashboard/bookings`}>View</Link>
                </Button>
              </div>
            ))}
            {safeBookings.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No recent bookings
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
