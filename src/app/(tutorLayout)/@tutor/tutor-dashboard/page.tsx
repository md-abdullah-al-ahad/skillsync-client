import { Suspense } from "react";
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
import type { Metadata } from "next";
import type { Booking } from "@/types";

export const metadata: Metadata = {
  title: "Tutor Dashboard | SkillSync",
  description: "Manage your tutoring sessions and track your performance",
};

async function DashboardStats() {
  const { data: bookings } = await bookingService.getBookings();

  const safeBookings: Booking[] = Array.isArray(bookings)
    ? (bookings as Booking[])
    : [];
  const totalSessions = safeBookings.length || 0;
  const completedSessions =
    safeBookings.filter((b) => b.status === "COMPLETED").length || 0;
  const totalEarnings =
    safeBookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + b.price, 0) || 0;

  // Calculate average rating (mock for now)
  const averageRating = 4.8;

  const stats = [
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

  return (
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
  );
}

async function TodaysSchedule() {
  const { data: bookings } = await bookingService.getBookings();
  const safeBookings: Booking[] = Array.isArray(bookings)
    ? (bookings as Booking[])
    : [];

  // Filter today's confirmed bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysBookings =
    safeBookings
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
      ) || [];

  return (
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
  );
}

async function RecentReviews() {
  // TODO: Get tutor profile ID from auth
  const tutorId = "temp-id"; // This should come from authenticated user
  const { data: reviews } = await reviewService.getReviewsByTutor(tutorId);

  const safeReviews = Array.isArray(reviews)
    ? reviews
    : Array.isArray((reviews as { data?: unknown })?.data)
      ? (reviews as { data: any[] }).data
      : [];
  const recentReviews = safeReviews.slice(0, 3) || [];

  return (
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
            {safeReviews.length > 3 && (
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/tutor-dashboard/sessions">View All Reviews</Link>
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
  );
}

function StatsSkeleton() {
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
}

function ScheduleSkeleton() {
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
}

export default function TutorDashboardPage() {
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
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Today's Schedule & Recent Reviews */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Suspense fallback={<ScheduleSkeleton />}>
          <TodaysSchedule />
        </Suspense>

        <Suspense fallback={<ScheduleSkeleton />}>
          <RecentReviews />
        </Suspense>
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
