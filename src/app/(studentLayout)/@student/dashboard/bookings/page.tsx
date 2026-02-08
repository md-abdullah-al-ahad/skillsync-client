"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { bookingService } from "@/services/booking.service";
import BookingCard from "@/components/modules/bookings/BookingCard";
import ReviewForm from "@/components/modules/reviews/ReviewForm";
import type { Booking } from "@/types";

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [tutorName, setTutorName] = useState<string>("");

  const fetchBookings = async () => {
    setIsLoading(true);
    const { data } = await bookingService.getBookings();
    setBookings(Array.isArray(data) ? (data as Booking[]) : []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleReview = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    setReviewBookingId(bookingId);
    setTutorName(booking?.tutorProfile?.user?.name || "Tutor");
  };

  const handleReviewSuccess = () => {
    fetchBookings();
  };

  // Filter bookings
  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.startTime) > now,
  );
  const pastBookings = bookings.filter(
    (b) =>
      b.status === "COMPLETED" ||
      (b.status === "CONFIRMED" && new Date(b.startTime) <= now),
  );
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

  const renderBookingList = (bookingList: Booking[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      );
    }

    if (bookingList.length === 0) {
      return (
        <Card className="border-border/60 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {bookingList.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            userRole="STUDENT"
            onUpdate={fetchBookings}
            onReview={handleReview}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Student Bookings
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your tutoring sessions
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-full border border-border/60 bg-muted/30 p-1">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {renderBookingList(upcomingBookings, "No upcoming bookings")}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {renderBookingList(pastBookings, "No past bookings")}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {renderBookingList(cancelledBookings, "No cancelled bookings")}
        </TabsContent>
      </Tabs>

      {/* Review Form Modal */}
      {reviewBookingId && (
        <ReviewForm
          open={!!reviewBookingId}
          onOpenChange={(open) => !open && setReviewBookingId(null)}
          bookingId={reviewBookingId}
          tutorName={tutorName}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
