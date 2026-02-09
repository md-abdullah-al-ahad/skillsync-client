"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/services/booking.service";
import { reviewService } from "@/services/review.service";
import ReviewCard from "@/components/modules/reviews/ReviewCard";
import { cn } from "@/lib/utils";
import type { Booking, Review } from "@/types";

const StatsSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
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

const ScheduleSkeleton = () => {
  return (
    <Card className="border-border/60 bg-muted/30">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </CardContent>
    </Card>
  );
};

export default function TutorDashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    const { data } = await bookingService.getBookings({ limit: 1000 });
    setBookings(Array.isArray(data) ? (data as Booking[]) : []);
    setIsLoadingBookings(false);
  };

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    const tutorId = "temp-id";
    const { data } = await reviewService.getReviewsByTutor(tutorId);

    const safeReviews = Array.isArray(data)
      ? (data as Review[])
      : Array.isArray((data as { data?: unknown })?.data)
        ? ((data as { data: Review[] }).data ?? [])
        : [];
    setReviews(safeReviews);
    setIsLoadingReviews(false);
  };

  useEffect(() => {
    void fetchBookings();
    void fetchReviews();
  }, []);

  const stats = useMemo(() => {
    const totalSessions = bookings.length || 0;
    const completedSessions =
      bookings.filter((b) => b.status === "COMPLETED").length || 0;
    const totalEarnings =
      bookings
        .filter((b) => b.status === "COMPLETED")
        .reduce((sum, b) => sum + b.price, 0) || 0;

    const averageRating = 4.8;

    return [
      {
        title: "Total Sessions",
        value: totalSessions,
        icon: Users,
        description: "All time sessions",
      },
      {
        title: "Completed",
        value: completedSessions,
        icon: TrendingUp,
        description: "Finished sessions",
      },
      {
        title: "Average Rating",
        value: averageRating.toFixed(1),
        icon: Star,
        description: "Out of 5.0",
      },
      {
        title: "Total Earnings",
        value: `$${totalEarnings.toFixed(0)}`,
        icon: DollarSign,
        description: "Total income",
        accent: true,
      },
    ];
  }, [bookings]);

  const todaysBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
      bookings
        .filter((b) => {
          const bookingDate = new Date(b.startTime);
          return (
            b.status === "CONFIRMED" &&
            bookingDate >= today &&
            bookingDate < tomorrow
          );
        })
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        ) || []
    );
  }, [bookings]);

  const recentReviews = useMemo(() => reviews.slice(0, 3) || [], [reviews]);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Message */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Tutor Overview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, Tutor!
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor sessions, earnings, and student feedback in one place.
          </p>
        </div>
        <Button asChild className="px-5">
          <Link href="/tutor-dashboard/availability">Add Availability</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoadingBookings ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className={cn(
                  "border-border/60 bg-muted/30",
                  stat.accent &&
                    "bg-gradient-to-br from-muted/60 via-muted/30 to-transparent",
                )}
              >
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

      {/* Today's Schedule & Recent Reviews */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {isLoadingBookings ? (
          <ScheduleSkeleton />
        ) : (
          <Card className="border-border/60 bg-muted/30">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <Badge variant="outline">
                  {todaysBookings.length} session
                  {todaysBookings.length === 1 ? "" : "s"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysBookings.length > 0 ? (
                <div className="space-y-3">
                  {todaysBookings.map((booking) => {
                    const startTime = new Date(booking.startTime);
                    const endTime = new Date(booking.endTime);
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {booking.student?.name || "Student"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(startTime, "h:mm a")} -{" "}
                              {format(endTime, "h:mm a")}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Confirmed</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No sessions scheduled for today
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {isLoadingReviews ? (
          <ScheduleSkeleton />
        ) : (
          <Card className="border-border/60 bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recent Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  {reviews.length > 3 && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Link href="/tutor-dashboard/sessions">
                        View All Reviews
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Star className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-auto flex-col items-start gap-3 border-border/60 bg-muted/30 px-5 py-6 text-left hover:bg-muted/50"
        >
          <Link href="/tutor-dashboard/sessions">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Users className="h-5 w-5" />
              View Sessions
            </div>
            <p className="text-sm text-muted-foreground">
              Track upcoming and completed lessons.
            </p>
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-auto flex-col items-start gap-3 border-border/60 bg-muted/30 px-5 py-6 text-left hover:bg-muted/50"
        >
          <Link href="/tutor-dashboard/availability">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Calendar className="h-5 w-5" />
              Manage Availability
            </div>
            <p className="text-sm text-muted-foreground">
              Open new slots and adjust your calendar.
            </p>
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-auto flex-col items-start gap-3 border-border/60 bg-muted/30 px-5 py-6 text-left hover:bg-muted/50"
        >
          <Link href="/tutor-dashboard/profile">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Star className="h-5 w-5" />
              Edit Profile
            </div>
            <p className="text-sm text-muted-foreground">
              Update your bio, rate, and subjects.
            </p>
          </Link>
        </Button>
      </div>
    </div>
  );
}
