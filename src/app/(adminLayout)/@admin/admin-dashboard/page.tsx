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
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
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

interface PlatformStats {
  users: { total: number; students: number; tutors: number };
  bookings: { total: number; completed: number; pending: number };
  revenue: { total: number };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

function AnalyticsBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [statsResponse, bookingsResponse] = await Promise.all([
        adminService.getStats(),
        adminService.getAllBookings(),
      ]);

      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
      setBookings(normalizeArray<Booking>(bookingsResponse.data));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const safeBookings = normalizeArray<Booking>(bookings);

  const totalUsers = stats?.users.total ?? 0;
  const totalStudents = stats?.users.students ?? 0;
  const totalTutors = stats?.users.tutors ?? 0;
  const totalBookings = stats?.bookings.total ?? 0;
  const completedBookings = stats?.bookings.completed ?? 0;
  const pendingBookings = stats?.bookings.pending ?? 0;
  const totalRevenue = stats?.revenue.total ?? 0;
  const cancelledBookings = safeBookings.filter(
    (b) => b.status === "CANCELLED",
  ).length;
  const confirmedBookings = safeBookings.filter(
    (b) => b.status === "CONFIRMED",
  ).length;

  const statCards = [
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
      description: `${completedBookings} completed, ${pendingBookings} pending`,
      href: "/admin-dashboard/bookings",
    },
    {
      title: "Platform Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "From completed sessions",
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
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const completionRate =
    totalBookings > 0
      ? Math.round((completedBookings / totalBookings) * 100)
      : 0;

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
        {statCards.map((stat) => {
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

      {/* Analytics Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnalyticsBar
              label="Students"
              value={totalStudents}
              max={totalUsers}
              color="bg-blue-500"
            />
            <AnalyticsBar
              label="Tutors"
              value={totalTutors}
              max={totalUsers}
              color="bg-emerald-500"
            />
            <AnalyticsBar
              label="Admins"
              value={totalUsers - totalStudents - totalTutors}
              max={totalUsers}
              color="bg-violet-500"
            />

            <div className="mt-4 grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-950/30">
                <GraduationCap className="mx-auto mb-1 h-5 w-5 text-blue-500" />
                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                  {totalStudents}
                </p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-950/30">
                <BookOpen className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  {totalTutors}
                </p>
                <p className="text-xs text-muted-foreground">Tutors</p>
              </div>
              <div className="rounded-lg bg-violet-50 p-3 text-center dark:bg-violet-950/30">
                <Users className="mx-auto mb-1 h-5 w-5 text-violet-500" />
                <p className="text-lg font-bold text-violet-700 dark:text-violet-400">
                  {totalUsers}
                </p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5" />
              Booking Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnalyticsBar
              label="Completed"
              value={completedBookings}
              max={totalBookings}
              color="bg-emerald-500"
            />
            <AnalyticsBar
              label="Confirmed (Upcoming)"
              value={confirmedBookings}
              max={totalBookings}
              color="bg-blue-500"
            />
            <AnalyticsBar
              label="Cancelled"
              value={cancelledBookings}
              max={totalBookings}
              color="bg-red-400"
            />

            <div className="mt-4 grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-950/30">
                <CheckCircle className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  {completedBookings}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-950/30">
                <Clock className="mx-auto mb-1 h-5 w-5 text-blue-500" />
                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                  {confirmedBookings}
                </p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-950/30">
                <XCircle className="mx-auto mb-1 h-5 w-5 text-red-400" />
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {cancelledBookings}
                </p>
                <p className="text-xs text-muted-foreground">Cancelled</p>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="mt-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Session Completion Rate
                </span>
                <span className="text-lg font-bold">{completionRate}%</span>
              </div>
              <div className="mt-2 h-3 w-full rounded-full bg-muted">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${
                    completionRate >= 70
                      ? "bg-emerald-500"
                      : completionRate >= 40
                        ? "bg-yellow-500"
                        : "bg-red-400"
                  }`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="h-5 w-5" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.role === "TUTOR"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : user.role === "ADMIN"
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  No recent users
                </div>
              )}
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/admin-dashboard/users">View All Users</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} href={action.href}>
                    <div className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <div className="rounded-lg bg-muted p-2">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold">
                          {action.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
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
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeBookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      booking.status === "COMPLETED"
                        ? "bg-emerald-100 dark:bg-emerald-950/30"
                        : booking.status === "CANCELLED"
                          ? "bg-red-100 dark:bg-red-950/30"
                          : "bg-blue-100 dark:bg-blue-950/30"
                    }`}
                  >
                    {booking.status === "COMPLETED" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : booking.status === "CANCELLED" ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Booking #{booking.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.status} • ${booking.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin-dashboard/bookings">View</Link>
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
