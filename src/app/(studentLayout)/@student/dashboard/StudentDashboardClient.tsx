"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, BookOpen, User, Search, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { bookingService } from "@/services/booking.service";
import BookingCard from "@/components/modules/bookings/BookingCard";
import type { Booking } from "@/types";

const StatsSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-border/60 bg-muted/30">
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const BookingsSkeleton = () => {
  return (
    <Card className="border-border/60 bg-muted/30">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </CardContent>
    </Card>
  );
};

export default function StudentDashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    const { data } = await bookingService.getBookings({ limit: 1000 });
    setBookings(Array.isArray(data) ? (data as Booking[]) : []);
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchBookings();
  }, []);

  const stats = useMemo(() => {
    const totalBookings = bookings.length || 0;
    const confirmedBookings =
      bookings.filter((b) => b.status === "CONFIRMED").length || 0;
    const completedSessions =
      bookings.filter((b) => b.status === "COMPLETED").length || 0;

    return [
      {
        title: "Total Bookings",
        value: totalBookings,
        icon: BookOpen,
        description: "All time bookings",
      },
      {
        title: "Upcoming Sessions",
        value: confirmedBookings,
        icon: Calendar,
        description: "Confirmed bookings",
      },
      {
        title: "Completed",
        value: completedSessions,
        icon: TrendingUp,
        description: "Finished sessions",
      },
    ];
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    const now = new Date();
    return (
      bookings
        .filter(
          (b) => b.status === "CONFIRMED" && new Date(b.startTime) > now,
        )
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        )
        .slice(0, 3) || []
    );
  }, [bookings]);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Message */}
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Student Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back!
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's an overview of your learning journey
        </p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border/60 bg-muted/30">
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
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-auto flex-col items-start gap-3 border-border/60 bg-muted/30 px-5 py-6 text-left hover:bg-muted/50"
        >
          <Link href="/tutors">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Search className="h-5 w-5" />
              Find a Tutor
            </div>
            <p className="text-sm text-muted-foreground">
              Browse experts and start a new session.
            </p>
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-auto flex-col items-start gap-3 border-border/60 bg-muted/30 px-5 py-6 text-left hover:bg-muted/50"
        >
          <Link href="/dashboard/bookings">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Calendar className="h-5 w-5" />
              My Bookings
            </div>
            <p className="text-sm text-muted-foreground">
              Track upcoming and completed sessions.
            </p>
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-auto flex-col items-start gap-3 border-border/60 bg-muted/30 px-5 py-6 text-left hover:bg-muted/50"
        >
          <Link href="/dashboard/profile">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <User className="h-5 w-5" />
              My Profile
            </div>
            <p className="text-sm text-muted-foreground">
              Update your contact and profile info.
            </p>
          </Link>
        </Button>
      </div>

      {/* Upcoming Bookings */}
      {isLoading ? (
        <BookingsSkeleton />
      ) : upcomingBookings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No upcoming sessions</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/tutors">
                  <Search className="mr-2 h-4 w-4" />
                  Find a Tutor
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                userRole="STUDENT"
                onUpdate={fetchBookings}
              />
            ))}
            {bookings.length > 3 && (
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/dashboard/bookings">View All Bookings</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
